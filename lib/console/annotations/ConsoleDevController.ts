import ConsoleController from './ConsoleController'
import { Conditional } from '../../core/lang/annotations/Conditional'
import { AppEnv } from '../../core/config/AppEnv'

export const ConsoleDevController = (path: string) => Conditional(
  () => AppEnv.inDevelopment,
  ConsoleController(path)
)

