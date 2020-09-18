import { Conditional } from './Conditional'
import { AppEnv } from '../../config/AppEnv'

export const WebOnly = <T extends (...args: any) => any> (annotation: T) => Conditional(
  () => AppEnv.asWeb,
  annotation
)
