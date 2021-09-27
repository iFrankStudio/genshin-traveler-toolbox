import debugLogger from 'electron-log'
import { isDebug, isDev } from '../utils'
import { Logger, LoggerFacade } from '/@main/logger'

export const INJECTIONS_SYMBOL = Symbol('__injections__')

export function Inject(type: string) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.has(target, INJECTIONS_SYMBOL)) {
      Reflect.set(target, INJECTIONS_SYMBOL, [])
    }
    if (!type) {
      throw new Error(`Inject recieved type: ${type}!`)
    } else {
      Reflect.get(target, INJECTIONS_SYMBOL).push({ type, field: propertyKey })
    }
  }
}

export class Service {
  readonly name: string
  private logger: LoggerFacade

  constructor(logger: Logger) {
    this.name = Object.getPrototypeOf(this).constructor.name
    this.logger = logger.createLoggerFor(this.name)

    if (isDev || isDebug) {
      debugLogger.transports.file.fileName = 'debug.log'
    } else {
      debugLogger.transports.console.level = false
      debugLogger.transports.file.level = false
    }
  }

  protected useLogger() {
    return this.logger
  }

  protected log(m: any, ...a: any[]) {
    this.logger.info(`[${this.name}] ${m}`, ...a)
  }

  protected error(m: any, ...a: any[]) {
    this.logger.error(`[${this.name}] ${m}`, ...a)
  }

  protected warn(m: any, ...a: any[]) {
    this.logger.warn(`[${this.name}] ${m}`, ...a)
  }

  protected debug(m: any, ...a: any[]) {
    debugLogger.debug(`[${this.name}] ${m}`, ...a)
  }
}
