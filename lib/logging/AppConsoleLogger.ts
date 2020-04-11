import { SingletonService } from '../core/di/annotations/SingletonService'
import { AppLoggerTkn } from './luxe-logging-tokens'
import { IAppLogger } from './IAppLogger'

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
    console.debug(message)
  }
}
