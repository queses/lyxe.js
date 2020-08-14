import ConsoleController from '../../lib/console/annotations/ConsoleController'
import { InjectService } from '../../lib/core/di/annotations/InjectService'
import { AppLoggerTkn } from '../../lib/logging/lyxe-logging-tokens'
import { IAppLogger } from '../../lib/logging/IAppLogger'
import ConsoleAction from '../../lib/console/annotations/ConsoleAction'

@ConsoleController('hello')
export class HelloConsoleAction {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  @ConsoleAction('run', 'Log into console')
  public run () {
    this.logger.log('Lyxe Framework successfully started!')
  }
}
