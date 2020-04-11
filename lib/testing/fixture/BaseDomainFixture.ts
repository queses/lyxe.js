import { IDomainFixture } from './IDomainFixture'
import { IHasId } from '../../persistence/IHasId'
import { TClass } from '../../core/di/luxe-di'
import { TPersistenceId } from '../../persistence/luxe-persistence'

export abstract class BaseDomainFixture implements IDomainFixture {
  public abstract getEntities (): Promise<{ [key: string]: IHasId }> | { [key: string]: IHasId }

  public readonly depends: Array<TClass<IDomainFixture>> = []
  public readonly dependsOnModules: string[] = []

  protected entity <E extends IHasId, ID extends TPersistenceId> (id: ID, entity: E) {
    Reflect.set(entity, 'id' as keyof E, id)
    return entity
  }
}
