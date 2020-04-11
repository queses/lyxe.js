import { IRepository } from '../persistence/IRepository'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/luxe-persistence'
import { TServiceId } from '../core/di/luxe-di'
import { IEntityManager } from '../persistence/IEntityManager'
import { AppContainer } from '../core/di/AppContainer'
import { RepositoryFactoryTkn } from '../persistence/luxe-persistence-tokens'
import { IContextService } from '../core/context/IContextService'
import { IDefaultContextFactory } from '../core/context/IDefaultContextFactory'
import { DefaultContextFactoryTkn } from '../core/luxe-core-tokens'
import { PersistenceContextUtil } from '../persistence/PersistenceContextUtil'
import { TBaseContextInfo } from '../core/context/luxe-context-info'

export class TestUtil {
  static createRepo <R extends IRepository<T, ID>, T extends IHasId<ID>, ID extends TPersistenceId> (
    id: TServiceId<R>,
    em: IEntityManager | undefined
  ) {
    return AppContainer.get(RepositoryFactoryTkn).get(id, em)
  }

  static createContextService <S extends IContextService<C>, C extends TBaseContextInfo> (
    id: TServiceId<S>,
    em: IEntityManager | undefined
  ) {
    const ctx = AppContainer.get<IDefaultContextFactory<C>>(DefaultContextFactoryTkn).get({ asSystem: true })
    const service = AppContainer.get<S>(id).configure(ctx)
    if (em) {
      PersistenceContextUtil.setTransactionalEm(service, em)
    }

    return service
  }
}