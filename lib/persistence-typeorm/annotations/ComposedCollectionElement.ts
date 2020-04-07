import { IComposedHasId } from '../../persistence/IComposedHasId'
import { TClass } from '../../core/di/luxe-di'
import { Entity } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'

export const ComposedCollectionElement = () => <E extends IComposedHasId<P>, P extends IHasId> (target: TClass<E>) => {
  Entity()(target)
}
