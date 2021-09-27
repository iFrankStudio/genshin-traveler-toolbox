import { SetOptional } from 'type-fest'

export type Task<T> = {
  worker: () => Promise<T> // 需要执行的任务
  // eslint-disable-next-line @typescript-eslint/ban-types
  signal: Function // 开始执行该任务的钩子，由队列前一任务执行完毕后触发。队列为空时第一个新任务直接开始执行，不需要钩子来启动
}

class SingleTaskQueue<T> {
  private tasks: Task<T>[] = []
  private timeout: number // milliseconds

  constructor(timeout = 1000) {
    if (timeout <= 0)
      throw new Error(
        `Illegal param 'timeout = ${timeout}': timeout must be greater than zero`
      )
    this.timeout = timeout
  }

  async newTask(worker: () => Promise<T>): Promise<T> {
    const task: SetOptional<Task<T>, 'signal'> = { worker }
    const signal = new Promise(resolve => {
      task.signal = resolve
    })

    const tasksAmount = this.tasks.push(task as Task<T>) // 将本次任务入栈
    if (tasksAmount > 1) {
      // 等待队列前序任务给出完成信号
      await signal
    }

    let result: T | Error
    const timer = new Promise<Error>(resolve => {
      setTimeout(() => {
        resolve(new Error(`${this.timeout}ms timeout!`))
      }, this.timeout)
    })
    try {
      result = await Promise.race<Promise<T | Error>>([task.worker(), timer]) // 执行任务
    } catch (err) {
      result = err as Error
    }

    this.tasks.shift() // 任务结束，出栈

    const tasksRemained = this.tasks.length
    if (tasksRemained > 0) {
      // 发出完成信号，开始执行下一任务
      const nextTask = this.tasks[0]
      nextTask.signal()
    }

    if (result instanceof Error) {
      throw result
    }
    return result
  }
}

export default SingleTaskQueue
