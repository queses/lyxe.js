import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const DevOnly = <T extends Function> (annotation: T) => Conditional(
  () => AppEnv.inDevelopment,
  annotation
)
