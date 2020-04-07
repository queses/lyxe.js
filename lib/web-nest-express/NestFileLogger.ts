import { AppLoggerTkn } from '../logging/luxe-logging-tokens'
import { ReplaceSingleton } from '../core/di/annotations/ReplaceSingleton'
import { IAppLogger } from '../logging/IAppLogger'
import * as winston from 'winston'
import { Logger } from '@nestjs/common'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { Cached } from '../core/lang/annotations/Cached'

@ReplaceSingleton(AppLoggerTkn)
export class NestFileLogger implements IAppLogger {
  public error (message: string, trace: string) {
    if (message) {
      this.errorFileLogger.log('error', message, { trace, at: new Date().toLocaleString() })
    }

    Logger.error(message, trace)
  }

  public log (message: any, context?: string): void {
    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.errorFileLogger.log('info', message, { at: new Date().toLocaleString() })
    }

    Logger.log(message, context)
  }

  public warn (message: any, context?: string): any {
    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.infoFileLogger.log('warn', message, { at: new Date().toLocaleString() })
    }

    Logger.warn(message, context)
  }

  public debug (message: any): void {
    if (message && AppConfigurator.get<boolean>('web.logInfoToFile')) {
      this.infoFileLogger.log('debug', message, { at: new Date().toLocaleString() })
    }

    Logger.debug(message)
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
}
