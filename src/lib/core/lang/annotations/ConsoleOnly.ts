import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const ConsoleOnly = <T extends (...args: any) => any> (annotation: T) => Conditional(
  () => AppEnv.asConsole,
  annotation
)
