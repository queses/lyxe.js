import { ConsoleControllerRegistry } from '../ConsoleControllerRegistry'
import { IConsoleController } from '../IConsoleController'
import { TClass } from '../../core/di/luxe-di'

const ConsoleAction = (name: string, descr: string) => 
  (target: IConsoleController, propertyKey: string) => {
    ConsoleControllerRegistry.inst.addAction(propertyKey, name, descr, target.constructor as TClass<IConsoleController>)
  }

export default ConsoleAction
