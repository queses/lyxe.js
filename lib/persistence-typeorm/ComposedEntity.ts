import { PrimaryGeneratedColumn } from 'typeorm'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/luxe-persistence'
import { IComposedHasId } from '../persistence/IComposedHasId'

export abstract class ComposedEntity <P extends IHasId<PI>, ID extends TPersistenceId = any, PI extends TPersistenceId = any>
  implements IComposedHasId<P, ID, PI>
{
  @PrimaryGeneratedColumn()
  private readonly id: ID

  public abstract readonly parent: Promise<P>

  getId () {
    return this.id
  }
}
