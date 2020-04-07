import { SingletonService } from '../core/di/annotations/SingletonService'
import { InjectService } from '../core/di/annotations/InjectService'
import { AppLoggerTkn } from '../logging/luxe-logging-tokens'
import { IAppLogger } from '../logging/IAppLogger'
import { ConsoleControllerRegistry } from './ConsoleControllerRegistry'
import { AppContainer } from '../core/di/AppContainer'
import { AppConfigurator } from '../core/config/AppConfigurator'

@SingletonService()
export class ConsoleRunner {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  public async run (actionPath?: string, args?: string[]): Promise<void> {
    actionPath = actionPath || process.argv[2]
    args = args || process.argv.slice(3)

    const action = ConsoleControllerRegistry.inst.getAction(actionPath)
    if (!action) {
      this.logger.error(`No console action found for path "${actionPath}"`)
      return
    }

    const inst = AppContainer.get(action.controllerClass)

    const tStart = process.hrtime()
    const method: Function = Reflect.get(inst, action.method)
    await method(args)

    if (AppConfigurator.get('console.measureActionsTime')) {
      this.logTimeDiff(tStart)
    }
  }

  private logTimeDiff (oldTime: [ number, number ]) {
    const time = process.hrtime(oldTime)
    this.logger.log(`Controller action took ${time[0]}.${time[1].toString().substr(0, 4)}s`)
  }
}
