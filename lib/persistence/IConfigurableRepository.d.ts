import { Page } from './Page'
import { IHasId } from './IHasId'
import { TPersistenceId } from './luxe-persistence'
import { SearchConfig } from './SearchConfig'
import { IRepository } from './IRepository'

export interface IConfigurableRepository
  <T extends IHasId<ID>, ID extends TPersistenceId, C extends SearchConfig = SearchConfig>
  extends IRepository<T, ID>
{
  findAll (config?: C): Promise<Page<T>>
  count (config?: C): Promise<number>
  existsById (id: ID, config?: C): Promise<boolean>
  findById (id: ID, config?: C): Promise<T | undefined>
  findByIds (ids: ID[], config?: C): Promise<T[]>
}
