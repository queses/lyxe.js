import { ConsoleControllerRegistry } from '../ConsoleControllerRegistry'
import { Conditional } from '../../core/lang/annotations/Conditional'
import { AppEnv } from '../../core/config/AppEnv'
import { TClass } from '../../core/di/luxe-di'
import { IConsoleController } from '../IConsoleController'
import { SingletonService } from '../../core/di/annotations/SingletonService'

const ConsoleController = (path: string) => Conditional(
  () => AppEnv.asConsole,
  (target: TClass<IConsoleController>) => {
    ConsoleControllerRegistry.inst.addController(path, target)
    return SingletonService()(target)
  }
)

export default ConsoleController
