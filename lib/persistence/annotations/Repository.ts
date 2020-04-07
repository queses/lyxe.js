import { IHasId } from '../IHasId'
import { TPersistenceId } from '../luxe-persistence'
import { IRepository } from '../IRepository'
import { TClass, TServiceId } from '../../core/di/luxe-di'
import { IPersistenceConnection } from '../IPersistenceConnection'
import { AppContainer } from '../../core/di/AppContainer'
import { DefaultPersistenceTkn } from '../luxe-persistence-tokens'
import { IEntityManager } from '../IEntityManager'
import { TransactionError } from '../../core/application-errors/TransactionError'
import { EntityManagerMeta } from '../EntityManagerMeta'

export const Repository = <T extends IHasId<ID>, ID extends TPersistenceId> (
  id: TServiceId<IRepository<T, ID>>, connectionId?: TServiceId<IPersistenceConnection>
) => (target: TClass<IRepository<T, ID>>) => {
  const connection = (connectionId) ? AppContainer.get(connectionId) : AppContainer.get(DefaultPersistenceTkn)
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
