import { TContextAuth } from '../auth/auth-context'
import { TBaseContextInfo } from '../core/context/luxie-context-info'
import { TAnyRequest } from './luxie-web'

export interface IWebContextInfoFactory <C extends TBaseContextInfo = TBaseContextInfo> {
  getContext (req: TAnyRequest, auth: TContextAuth | undefined): C
}
