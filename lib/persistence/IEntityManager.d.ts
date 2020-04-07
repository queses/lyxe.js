import { IHasId } from './IHasId'
import { TPersistenceId } from './luxe-persistence'
import { TClass } from '../core/di/luxe-di'

export interface IEntityManager {
  save <T extends IHasId<ID>, ID extends TPersistenceId> (entity: T | T[]): Promise<T>
  delete <T extends IHasId<ID>, ID extends TPersistenceId> (entityClass: string | TClass<T>, entity: T): Promise<{}>
  findOne <T extends IHasId<ID>, ID extends TPersistenceId> (entityClass: string | TClass<T>, id: ID): Promise<T>
}
