import { IHasId } from './IHasId'
import { TPersistenceId } from './luxie-persistence'

export interface IComposedHasId
  <P extends IHasId<PID>, ID extends TPersistenceId = TPersistenceId, PID extends TPersistenceId = TPersistenceId>
  extends IHasId<ID>
{
  readonly parent: P | Promise<P>
}
