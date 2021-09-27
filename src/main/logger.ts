/* eslint-disable @typescript-eslint/no-empty-function */
import { app, BrowserWindow } from 'electron'
import { createWriteStream } from 'fs'
import { join, resolve } from 'path'
import { PassThrough, pipeline, Transform } from 'stream'
import { format } from 'util'

function formatMsg(message: unknown, options: unknown[]) {
  return options.length !== 0 ? format(message, options) : format(message)
}
function baseTransform(tag: string) {
  return new Transform({
    transform(c, e, cb) {
      cb(undefined, `[${tag}] [${new Date().toLocaleString()}] ${c}\n`)
    }
  })
}

export interface LoggerFacade {
  info(message: unknown, ...options: unknown[]): void
  warn(message: unknown, ...options: unknown[]): void
  error(message: unknown, ...options: unknown[]): void
}

export class Logger {
  private loggerEntries = {
    info: baseTransform('INFO'),
    warn: baseTransform('WARN'),
    error: baseTransform('ERROR')
  }

  readonly info = (message: unknown, ...options: unknown[]) => {
    this.loggerEntries.info.write(formatMsg(message, options))
  }

  readonly warn = (message: unknown, ...options: unknown[]) => {
    this.loggerEntries.warn.write(formatMsg(message, options))
  }

  readonly error = (message: unknown, ...options: unknown[]) => {
    this.loggerEntries.error.write(formatMsg(message, options))
  }

  private output = new PassThrough()

  private logDirectory = ''

  constructor() {
    pipeline(this.loggerEntries.info, this.output, () => {})
    pipeline(this.loggerEntries.warn, this.output, () => {})
    pipeline(this.loggerEntries.error, this.output, () => {})

    process.on('uncaughtException', err => {
      this.error('Uncaught Exception')
      this.error(err)
    })
    process.on('unhandledRejection', reason => {
      this.error('Uncaught Rejection')
      this.error(reason)
    })
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'debug'
    ) {
      this.output.on('data', b => {
        console.log(b.toString())
      })
    }
    app.once('browser-window-created', (event, window) => {
      this.captureWindowLog(window)
    })
  }

  /**
   * Initialize log output directory
   * @param directory The directory of the log
   */
  initialize(directory: string, filename = 'main.log') {
    this.logDirectory = directory
    const logFile = join(directory, filename)
    const stream = createWriteStream(logFile, {
      encoding: 'utf-8',
      flags: 'w+'
    })
    this.output.pipe(stream)
    this.info(`Setup main logger to ${logFile}`)
    return this
  }

  /**
   * Capture the window log
   * @param window The browser window
   * @param name The name alias of the window. Use window.webContents.id by default
   */
  captureWindowLog(window: BrowserWindow, name?: string) {
    name = name ?? window.webContents.id.toString()
    if (!this.logDirectory) {
      this.warn(
        `Cannot capture window log for window ${name}. Please initialize the logger to set logger directory!`
      )
      return
    }
    const loggerPath = resolve(this.logDirectory, `renderer.${name}.log`)
    this.info(`Setup renderer logger for window ${name} to ${loggerPath}`)
    const stream = createWriteStream(loggerPath, {
      encoding: 'utf-8',
      flags: 'w+'
    })
    const levels = ['INFO', 'WARN', 'ERROR']
    window.webContents.on('console-message', (e, level, message, line, id) => {
      stream.write(
        `[${levels[level]}] [${new Date().toUTCString()}] [${id}]: ${message}\n`
      )
    })
    window.once('close', () => {
      window.webContents.removeAllListeners('console-message')
      stream.close()
    })
  }

  /**
   * This will create a logger prepend [${tag}] before each log from it
   * @param tag The tag to prepend
   */
  createLoggerFor(tag: string): LoggerFacade {
    function transform(tag: string) {
      return new Transform({
        transform(c, e, cb) {
          cb(undefined, `[${tag}] ${c}\n`)
        }
      })
    }
    const log = transform(tag).pipe(this.loggerEntries.info)
    const warn = transform(tag).pipe(this.loggerEntries.warn)
    const error = transform(tag).pipe(this.loggerEntries.error)

    return {
      info(message: unknown, ...options: unknown[]) {
        log.write(formatMsg(message, options))
      },
      warn(message: unknown, ...options: unknown[]) {
        warn.write(formatMsg(message, options))
      },
      error(message: unknown, ...options: unknown[]) {
        error.write(formatMsg(message, options))
      }
    }
  }
}
