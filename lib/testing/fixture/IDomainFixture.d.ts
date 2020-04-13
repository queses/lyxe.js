import { IHasId } from '../../persistence/IHasId'
import { TClass } from '../../core/di/luxe-di'
import { IEntityManager } from '../../persistence/IEntityManager'

export interface IDomainFixture {
  depends: Array<TClass<IDomainFixture>>
  dependsOnModules: string[]
  getEntities (em: IEntityManager): Promise<{ [key: string]: IHasId }> | { [key: string]: IHasId }
}
