import { IContextService } from '../core/context/IContextService'
import { TBaseContextInfo } from '../core/context/luxie-context-info'
import { TServiceId } from '../core/di/luxie-di'
import { AppContainer } from '../core/di/AppContainer'

export class ConsoleContextUtil {
  static createService <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>): S {
    return AppContainer.get(id).configure({ asSystem: true } as C)
  }

  static createUseCase <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>): S {
    return this.createService(id)
  }
}
