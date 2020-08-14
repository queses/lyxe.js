import ConsoleAction from 'lyxe/lib/console/annotations/ConsoleAction'
import ConsoleController from 'lyxe/lib/console/annotations/ConsoleController'
import { InjectService } from 'lyxe/lib/core/di/annotations/InjectService'
import { AppLoggerTkn } from 'lyxe/lib/logging/lyxe-logging-tokens'
import { IAppLogger } from 'lyxe/lib/logging/IAppLogger'

@ConsoleController('hello')
export class HelloConsoleAction {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  @ConsoleAction('run', 'Log into console')
  public run () {
    this.logger.log('Lyxe Framework successfully started!')
  }
}
