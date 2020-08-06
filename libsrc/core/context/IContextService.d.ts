import { TBaseContextInfo } from './luxie-context-info'

export interface IContextService <C extends TBaseContextInfo = TBaseContextInfo> {
  configure (context: C | undefined): this
  contextInfo?: C
}

