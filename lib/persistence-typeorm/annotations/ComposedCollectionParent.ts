import { ManyToOne, ObjectType } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'
import { TPersistenceId } from '../../persistence/luxie-persistence'

export const ComposedCollectionParent = <P extends IHasId<ID>, ID extends TPersistenceId> (typeFn: (type?: any) => ObjectType<P>) =>
  ManyToOne(typeFn, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
