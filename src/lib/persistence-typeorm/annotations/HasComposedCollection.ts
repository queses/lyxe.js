import { ObjectType, OneToMany } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'
import { IComposedHasId } from '../../persistence/IComposedHasId'

export const HasComposedCollection = <E extends IComposedHasId<P>, P extends IHasId> (typeFn: (type?: any) => ObjectType<E>) =>
  OneToMany(typeFn, rel => rel['parent'], { cascade: true, eager: true })
