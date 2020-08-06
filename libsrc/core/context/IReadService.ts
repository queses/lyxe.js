import { IContextService } from './IContextService'
import { TBaseContextInfo } from './luxie-context-info'

export interface IReadService <C extends TBaseContextInfo = TBaseContextInfo> extends IContextService<C> {}
