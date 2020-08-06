import ConsoleAction from '../../../libsrc/console/annotations/ConsoleAction'
import ConsoleController from '../../../libsrc/console/annotations/ConsoleController'
import { InjectService } from '../../../libsrc/core/di/annotations/InjectService'
import { AppLoggerTkn } from '../../../libsrc/logging/lyxe-logging-tokens'
import { IAppLogger } from '../../../libsrc/logging/IAppLogger'

@ConsoleController('hello')
export class HelloConsoleAction {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  @ConsoleAction('run', 'Log into console')
  public run () {
    this.logger.log('Luxie Framework successfully started!')
  }
}
