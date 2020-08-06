import { TBaseContextInfo } from './luxie-context-info'
import { IContextService } from './IContextService'

export interface IUseCase <C extends TBaseContextInfo = TBaseContextInfo, A = any, R = any> extends IContextService<C> {
  run (...args: A[]): R
}
