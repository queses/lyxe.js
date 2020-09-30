import { IHasId } from './IHasId'
import { TPersistenceId } from './lyxe-persistence'
import { TClass } from '../core/di/lyxe-di'

export interface IEntityManager {
  save <T extends IHasId<ID>, ID extends TPersistenceId> (entity: T | T[]): Promise<T>
  delete <T extends IHasId<ID>, ID extends TPersistenceId> (entityClass: string | TClass<T>, entity: T): Promise<T>
  findOne <T extends IHasId<ID>, ID extends TPersistenceId> (entityClass: string | TClass<T>, id: ID): Promise<T>
}
