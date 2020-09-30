import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const DevOnly = <T extends (...args: any) => any> (annotation: T) => Conditional(
  () => AppEnv.inDevelopment,
  annotation
)
