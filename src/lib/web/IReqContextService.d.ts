import { TAnyRequest } from './lyxe-web'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'

export interface IReqContextService {
  writeContextToReq (req: TAnyRequest): void | Promise<void>
  readContextFromReq <C extends TBaseContextInfo> (req: TAnyRequest): C
}
