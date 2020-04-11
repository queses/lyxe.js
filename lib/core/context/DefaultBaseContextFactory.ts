import { TBaseContextInfo } from './luxe-context-info'
import { SingletonService } from '../di/annotations/SingletonService'
import { DefaultContextFactoryTkn } from '../luxe-core-tokens'
import { IDefaultContextFactory } from './IDefaultContextFactory'

@SingletonService(DefaultContextFactoryTkn)
export class DefaultBaseContextFactory implements IDefaultContextFactory {
  get (base: TBaseContextInfo): TBaseContextInfo {
    return base
  }
}
