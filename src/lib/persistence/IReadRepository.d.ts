import { IHasId } from './IHasId'
import { TPersistenceId } from './lyxe-persistence'

export interface IReadRepository <T extends IHasId<ID>, ID extends TPersistenceId> {
  cache (toCache?: boolean): this
  count (): Promise<number>
  existsById (id: ID): Promise<boolean>
  findAll (): Promise<T[]>
  findById (id: ID): Promise<T | undefined>
  findByIds (ids: ID[]): Promise<T[]>
  refresh (entity: T): Promise<T>
}
