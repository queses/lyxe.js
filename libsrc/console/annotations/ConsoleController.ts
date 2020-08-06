import { ConsoleControllerRegistry } from '../ConsoleControllerRegistry'
import { TClass } from '../../core/di/lyxe-di'
import { IConsoleController } from '../IConsoleController'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { ConsoleOnly } from '../../core/lang/annotations/ConsoleOnly'

const ConsoleController = (path: string) => ConsoleOnly((target: TClass<IConsoleController>) => {
  ConsoleControllerRegistry.inst.addController(path, target)
  return SingletonService()(target)
})

export default ConsoleController
