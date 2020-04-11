import { AppInitActionsRunner } from '../AppInitActionsRunner'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import ConsoleController from '../../console/annotations/ConsoleController'

@ConsoleController('lx:app-init')
export class AppInitController {
  @ConsoleAction('run', 'Run application init actions')
  public async run () {
    await new AppInitActionsRunner().run()
  }
}
