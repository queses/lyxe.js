import { IEntityManager } from './IEntityManager'
import { IRepository } from './IRepository'
import { IHasId } from './IHasId'
import { TPersistenceId } from './lyxe-persistence'
import { TServiceId } from '../core/di/lyxe-di'

export interface IRepositoryFactory {
  get <T extends IRepository<E, ID>, E extends IHasId<ID>, ID extends TPersistenceId> (
    token: TServiceId<T>, transactionalEm?: IEntityManager
  ): T
}
