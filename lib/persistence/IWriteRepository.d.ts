import { IHasId } from './IHasId'
import { TPersistenceId } from './luxie-persistence'

export interface IWriteRepository <T extends IHasId<ID>, ID extends TPersistenceId> {
  delete (entity: T): Promise<void>
  deleteAll (): Promise<void>
  deleteMany (entities: T[]): Promise<void>
  deleteById (id: ID): Promise<void>
  save (entity: T): Promise<T>
  saveMany (entities: T[]): Promise<T[]>
}
