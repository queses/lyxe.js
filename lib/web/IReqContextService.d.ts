import { TAnyRequest } from './luxie-web'
import { TBaseContextInfo } from '../core/context/luxie-context-info'

export interface IReqContextService {
  writeContextToReq (req: TAnyRequest): void | Promise<void>
  readContextFromReq <C extends TBaseContextInfo> (req: TAnyRequest): C
}
