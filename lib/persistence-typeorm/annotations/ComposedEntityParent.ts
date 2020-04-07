import { JoinColumn, ObjectType, OneToOne } from 'typeorm'
import { IHasId } from '../../persistence/IHasId'
import { IComposedHasId } from '../../persistence/IComposedHasId'
import { TPersistenceId } from '../../persistence/luxe-persistence'

export const ComposedEntityParent = <P extends IHasId<ID>, ID extends TPersistenceId, E extends IComposedHasId<P, number, ID>> (
  typeFn: (type?: any) => ObjectType<P>
) => (entity: E, propertyName: string) => {
  OneToOne(typeFn, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })(entity, propertyName)
  JoinColumn()(entity, propertyName)
}
