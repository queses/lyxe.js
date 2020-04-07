import { InitActionsRunner } from '../InitActionsRunner'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import ConsoleController from '../../console/annotations/ConsoleController'

@ConsoleController('lx:app-init')
export class DomainFixtureController {
  @ConsoleAction('run', 'Run application init actions')
  public async run () {
    await new InitActionsRunner().run()
  }
}
