import { SingletonService } from '../core/di/annotations/SingletonService'
import { RepositoryFactoryTkn } from './lyxe-persistence-tokens'
import { IRepositoryFactory } from './IRepositoryFactory'
import { IRepository } from './IRepository'
import { IHasId } from './IHasId'
import { TPersistenceId } from './lyxe-persistence'
import { TServiceId } from '../core/di/lyxe-di'
import { IEntityManager } from './IEntityManager'
import { AppContainer } from '../core/di/AppContainer'

@SingletonService(RepositoryFactoryTkn)
export class RepositoryFactory implements IRepositoryFactory {
  get <T extends IRepository<E, ID>, E extends IHasId<ID>, ID extends TPersistenceId> (
    token: TServiceId<T>, transactionalEm?: IEntityManager
  ) {
    const factory = AppContainer.getFactory(token)
    return factory(transactionalEm)
  }
}
