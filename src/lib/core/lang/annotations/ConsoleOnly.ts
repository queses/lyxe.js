import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const ConsoleOnly = <T extends Function> (annotation: T) => Conditional(
  () => AppEnv.asConsole,
  annotation
)
