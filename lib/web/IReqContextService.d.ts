import { TAnyRequest } from './luxe-web'
import { TBaseContextInfo } from '../core/context/luxe-context-info'

export interface IReqContextService {
  writeContextToReq (req: TAnyRequest): void | Promise<void>
  readContextFromReq <C extends TBaseContextInfo> (req: TAnyRequest): C
}
