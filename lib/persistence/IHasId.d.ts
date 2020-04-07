import { TPersistenceId } from './luxe-persistence'

export interface IHasId <ID extends TPersistenceId = number> {
  getId (): ID
}
