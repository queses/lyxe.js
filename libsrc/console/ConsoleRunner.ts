import { SingletonService } from '../core/di/annotations/SingletonService'
import { InjectService } from '../core/di/annotations/InjectService'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { IAppLogger } from '../logging/IAppLogger'
import { ConsoleControllerRegistry } from './ConsoleControllerRegistry'
import { AppContainer } from '../core/di/AppContainer'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { DebugUtil } from '../core/lang/DebugUtil'
import { LyxeFramework } from '../core/LuxieFramework'

@SingletonService()
export class ConsoleRunner {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  public async run (actionPath?: string, args?: string[], shutdownFramework: boolean = true): Promise<void> {
    actionPath = actionPath || process.argv[2]
    args = args || process.argv.slice(3)

    const action = ConsoleControllerRegistry.inst.getAction(actionPath)
    if (!action) {
      this.logger.error(`No console action found for path "${actionPath}"`)
      if (shutdownFramework) {
        await LyxeFramework.shutdown()
      }

      return
    }

    const inst = AppContainer.get(action.controllerClass)

    const tStart = process.hrtime()
    const method: Function = Reflect.get(inst, action.method)
    await method.call(inst, args)

    if (AppConfigurator.get('console.measureActionsTime')) {
      this.logTimeDiff(tStart)
    }

    if (shutdownFramework) {
      await LyxeFramework.shutdown()
    }
  }

  private logTimeDiff (oldTime: [ number, number ]) {
    this.logger.log(`Controller action execution took ${DebugUtil.formatHrtime(process.hrtime(oldTime))}`)
  }
}
