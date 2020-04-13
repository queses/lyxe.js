import { TContextAuth } from '../auth/auth-context'
import { TBaseContextInfo } from '../core/context/luxe-context-info'
import { TAnyRequest } from './luxe-web'

export interface IWebContextInfoFactory <C extends TBaseContextInfo = TBaseContextInfo> {
  getContext (req: TAnyRequest, auth: TContextAuth | undefined): C
}
