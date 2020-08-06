import { TContextAuth } from '../auth/auth-context'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'
import { TAnyRequest } from './lyxe-web'

export interface IWebContextInfoFactory <C extends TBaseContextInfo = TBaseContextInfo> {
  getContext (req: TAnyRequest, auth: TContextAuth | undefined): C
}
