import { TBaseContextInfo } from './luxe-context-info'

export interface IContextService <C extends TBaseContextInfo = TBaseContextInfo> {
  configure (context: C | undefined): this
  contextInfo?: C
}

