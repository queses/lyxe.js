import { ComposedEntity } from './ComposedEntity'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/lyxe-persistence'
import { IComposedHasId } from '../persistence/IComposedHasId'

export abstract class CollectedValueObject <P extends IHasId<PI>, ID extends TPersistenceId = any, PI extends TPersistenceId = any>
  extends ComposedEntity<P, ID, PI>
  implements IComposedHasId<P, ID, PI> {}
