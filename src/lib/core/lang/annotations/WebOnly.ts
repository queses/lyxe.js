import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const WebOnly = <T extends Function> (annotation: T) => Conditional(
  () => AppEnv.asWeb,
  annotation
)
