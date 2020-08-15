import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { ReplaceSingleton } from '../core/di/annotations/ReplaceSingleton'
import { IAppLogger } from '../logging/IAppLogger'
import * as winston from 'winston'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { Cached } from '../core/lang/annotations/Cached'
import { AppEnv } from '../core/config/AppEnv'

@ReplaceSingleton(AppLoggerTkn)
export class ExpressLogger implements IAppLogger {
  public error (message: string, trace: string) {
    if (message) {
      this.errorFileLogger.log('error', message, { trace, at: new Date().toLocaleString() })
    }

    this.consoleLogger.error(message, trace)
  }

  public log (message: any, context?: string): void {
    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.errorFileLogger.log('info', message, { at: new Date().toLocaleString() })
    }

    this.consoleLogger.info(message, context)
  }

  public warn (message: any, context?: string): any {
    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.infoFileLogger.log('warn', message, { at: new Date().toLocaleString() })
    }

    this.consoleLogger.warn(message, context)
  }

  public debug (message: any): void {
    if (AppEnv.inProduction) {
      return
    }

    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.infoFileLogger.log('debug', message, { at: new Date().toLocaleString() })
    }

    this.consoleLogger.debug(message)
  }

  @Cached()
  private get errorFileLogger () {
    const logsPath = AppPathUtil.appLogs
    return winston.createLogger({
      format: winston.format.prettyPrint(),
      transports: [ new winston.transports.File({ filename: `${logsPath}/error.log`, level: 'error' }) ]
    })
  }

  @Cached()
  private get infoFileLogger () {
    const logsPath = AppPathUtil.appLogs
    return winston.createLogger({
      format: winston.format.prettyPrint(),
      transports: [ new winston.transports.File({ filename: `${logsPath}/info.log`, level: 'info' }) ]
    })
  }

  @Cached()
  private get consoleLogger () {
    return winston.createLogger({
      transports: [ new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.label({ label: 'LyxeJS' }),
          winston.format.printf(info => {
            const time = new Date(info.timestamp).toLocaleString()
            return `[${info.label} ${info.level}] ${time}: ${info.message}`
          })
      )
      }) ]
    })
  }
}
