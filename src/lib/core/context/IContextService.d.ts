import { TBaseContextInfo } from './lyxe-context-info'
import { TServiceId } from '../di/lyxe-di'

export interface IContextService <C extends TBaseContextInfo = TBaseContextInfo> {
  configure (context: C | undefined): this
  createService <T extends IContextService> (id: TServiceId<T>): T
  createContextService <T extends IContextService> (id: TServiceId<T>): T
  contextInfo?: C
}

