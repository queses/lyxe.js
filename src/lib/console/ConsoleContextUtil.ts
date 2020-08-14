import { IContextService } from '../core/context/IContextService'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'
import { TServiceId } from '../core/di/lyxe-di'
import { AppContainer } from '../core/di/AppContainer'

export class ConsoleContextUtil {
  static createContextService <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>): S {
    return AppContainer.get(id).configure({ asSystem: true } as C)
  }

  static createService <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>): S {
    return this.createContextService(id)
  }
}
