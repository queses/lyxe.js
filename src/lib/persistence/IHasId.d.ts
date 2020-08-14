import { TPersistenceId } from './lyxe-persistence'

export interface IHasId <ID extends TPersistenceId = number> {
  getId (): ID
}
