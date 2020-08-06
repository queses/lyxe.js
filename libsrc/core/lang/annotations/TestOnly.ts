import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const TestOnly = <T extends Function> (annotation: T) => Conditional(
  () => AppEnv.inTest,
  annotation
)
