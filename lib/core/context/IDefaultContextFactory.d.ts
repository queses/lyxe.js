import { TBaseContextInfo } from './luxe-context-info'

export interface IDefaultContextFactory <C extends TBaseContextInfo = any> {
  get (base: TBaseContextInfo): C
}
