import { ObjectType, OneToMany } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'
import { IComposedHasId } from '../../persistence/IComposedHasId'

export const HasValuesCollection = <E extends IComposedHasId<P>, P extends IHasId<any>> (typeFn: (type?: any) => ObjectType<E>) =>
  OneToMany(typeFn, rel => rel['parent'], { cascade: true, eager: true })
