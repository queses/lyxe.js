import { IContextService } from './IContextService'
import { TBaseContextInfo } from './luxe-context-info'

export interface IReadService <C extends TBaseContextInfo = TBaseContextInfo> extends IContextService<C> {}
