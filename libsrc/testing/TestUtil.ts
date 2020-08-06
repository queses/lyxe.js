import { IRepository } from '../persistence/IRepository'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/luxie-persistence'
import { TServiceId } from '../core/di/luxie-di'
import { IEntityManager } from '../persistence/IEntityManager'
import { AppContainer } from '../core/di/AppContainer'
import { RepositoryFactoryTkn } from '../persistence/luxie-persistence-tokens'
import { IContextService } from '../core/context/IContextService'
import { PersistenceContextUtil } from '../persistence/PersistenceContextUtil'
import { TBaseContextInfo } from '../core/context/luxie-context-info'
import { IServiceFactory } from '../core/context/IServiceFactory'
import { ServiceFactory } from '../core/context/ServiceFactory'

export class TestUtil {
  static createRepo <R extends IRepository<T, ID>, T extends IHasId<ID>, ID extends TPersistenceId> (
    id: TServiceId<R>,
    emSf: IEntityManager | IServiceFactory | undefined
  ) {
    if (emSf && (emSf as IServiceFactory).contextInfo) {
      emSf = PersistenceContextUtil.getTransactionalEm(emSf as IServiceFactory)
    }

    return AppContainer.get(RepositoryFactoryTkn).get(id, emSf as IEntityManager | undefined)
  }

  static createContextService <S extends IContextService<C>, C extends TBaseContextInfo> (
    id: TServiceId<S>,
    em: IEntityManager | undefined
  ) {
    const service = AppContainer.get<S>(id).configure({ asSystem: true } as C)
    if (em) {
      PersistenceContextUtil.setTransactionalEm(service, em)
    }

    return service
  }

  static createServiceFactory <C extends TBaseContextInfo> (em: IEntityManager | undefined) {
    return this.createContextService<IServiceFactory<C>, C>(ServiceFactory, em)
  }
}
