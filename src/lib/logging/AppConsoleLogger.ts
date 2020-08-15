import { SingletonService } from '../core/di/annotations/SingletonService'
import { AppLoggerTkn } from './lyxe-logging-tokens'
import { IAppLogger } from './IAppLogger'
import { AppEnv } from '../core/config/AppEnv'

@SingletonService(AppLoggerTkn)
export class AppConsoleLogger implements IAppLogger {
  public error (message: string, stack?: string): void {
    console.error(message, stack || '')
  }

  public log (message: string): void {
    console.log(message)
  }

  public warn (message: string): void {
    console.warn(message)
  }

  public debug (message: string): void {
    if (AppEnv.inProduction) {
      return
    }

    console.debug(message)
  }
}
