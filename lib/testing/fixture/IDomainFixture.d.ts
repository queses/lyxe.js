import { IHasId } from '../../persistence/IHasId'
import { TClass } from '../../core/di/luxe-di'

export interface IDomainFixture {
  depends: Array<TClass<IDomainFixture>>
  dependsOnModules: string[]
  getEntities (): Promise<{ [key: string]: IHasId }> | { [key: string]: IHasId }
}
