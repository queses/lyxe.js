import { ObjectType, OneToOne } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'
import { IComposedHasId } from '../../persistence/IComposedHasId'

export const HasComposedEntity = <E extends IComposedHasId<P>, P extends IHasId> (typeFn: (type?: any) => ObjectType<E>) =>
  OneToOne(typeFn, rel => rel['parent'], { cascade: true })
