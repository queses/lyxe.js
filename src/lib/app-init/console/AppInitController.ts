import { AppInitActionsRunner } from '../AppInitActionsRunner'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import ConsoleController from '../../console/annotations/ConsoleController'
import { InjectService } from '../../core/di/annotations/InjectService'

@ConsoleController('lx:app-init')
export class AppInitController {
  @InjectService(AppInitActionsRunner)
  private runner: AppInitActionsRunner

  @ConsoleAction('run', 'Run application init actions')
  public async run () {
    await this.runner.run()
  }
}
