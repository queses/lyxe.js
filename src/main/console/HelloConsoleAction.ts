import ConsoleAction from '../../../lib/console/annotations/ConsoleAction'
import ConsoleController from '../../../lib/console/annotations/ConsoleController'
import { InjectService } from '../../../lib/core/di/annotations/InjectService'
import { AppLoggerTkn } from '../../../lib/logging/luxie-logging-tokens'
import { IAppLogger } from '../../../lib/logging/IAppLogger'

@ConsoleController('hello')
export class HelloConsoleAction {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  @ConsoleAction('run', 'Log into console')
  public run () {
    this.logger.log('Luxie Framework successfully started!')
  }
}
