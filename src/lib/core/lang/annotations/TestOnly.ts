import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const TestOnly = <T extends (...args: any) => any> (annotation: T) => Conditional(
  () => AppEnv.inTest,
  annotation
)
