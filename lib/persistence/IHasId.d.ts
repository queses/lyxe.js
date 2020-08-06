import { TPersistenceId } from './luxie-persistence'

export interface IHasId <ID extends TPersistenceId = number> {
  getId (): ID
}
