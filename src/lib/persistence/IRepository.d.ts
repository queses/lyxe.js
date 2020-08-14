import { IReadRepository } from './IReadRepository'
import { IWriteRepository } from './IWriteRepository'
import { IHasId } from './IHasId'
import { TPersistenceId } from './lyxe-persistence'

export interface IRepository <T extends IHasId<ID>, ID extends TPersistenceId>
  extends IReadRepository<T, ID>, IWriteRepository<T, ID> {}
