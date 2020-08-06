import { IHasId } from '../IHasId'
import { TPersistenceConnectionName, TPersistenceId } from '../luxie-persistence'
import { IRepository } from '../IRepository'
import { TClass, TServiceId } from '../../core/di/luxie-di'
import { AppContainer } from '../../core/di/AppContainer'
import { IEntityManager } from '../IEntityManager'
import { TransactionError } from '../../core/application-errors/TransactionError'
import { EntityManagerMeta } from '../EntityManagerMeta'
import { PersistenceConnectionRegistry } from '../PersistenceConnectionRegistry'

export const Repository = <T extends IHasId<ID>, ID extends TPersistenceId> (
  id: TServiceId<IRepository<T, ID>>,
  connectionName?: TPersistenceConnectionName
) => (target: TClass<IRepository<T, ID>>) => {
  const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
  AppContainer.inst.setFactory(id, (transactionalEm: IEntityManager | undefined) => {
    if (!transactionalEm) {
      return new target(connection.getManager())
    } else if (Reflect.getMetadata(EntityManagerMeta.CONNECTION, transactionalEm) === connection) {
      return new target(transactionalEm)
    } else {
      throw new TransactionError('Trying to use repository with other connection in transaction')
    }
  })
}
