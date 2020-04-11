import { TMochaTransactionalTest } from '../framework-testing'
import { AppContainer } from '../../core/di/AppContainer'
import { IEntityManager } from '../../persistence/IEntityManager'
import { ServiceFactory } from '../../core/context/ServiceFactory'
import { TBaseContextInfo } from '../../core/context/luxe-context-info'
import { DefaultContextFactoryTkn } from '../../core/luxe-core-tokens'
import { IDefaultContextFactory } from '../../core/context/IDefaultContextFactory'
import { PersistenceContextMeta } from '../../persistence/PersistenceContextMeta'
import { IServiceFactory } from '../../core/context/IServiceFactory'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { TPersistenceConnectionName } from '../../persistence/luxe-persistence'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'

export const itInTransaction = <C extends TBaseContextInfo> (
  expectation: string,
  assertion: TMochaTransactionalTest<C>,
  connectionName?: TPersistenceConnectionName
) => {
  const connection = PersistenceConnectionRegistry.get(connectionName)
  if (!connection.transaction || !connection.nestedTransaction) {
    throw new InvalidArgumentError('itInTransaction error: provided connection is not transactional')
  }

  const { transaction, nestedTransaction } = connection
  const transactionalAssertion = function (this: Mocha.Test & any, done: Mocha.Done) {
    const run = async (entityManager: IEntityManager) => {
      const ctx = AppContainer.get<IDefaultContextFactory<C>>(DefaultContextFactoryTkn).get({ asSystem: true })
      Reflect.defineMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, entityManager, ctx)
      const sf = AppContainer.get<IServiceFactory<C>>(ServiceFactory).configure(ctx)
      await assertion.bind(this)(sf, entityManager)
      throw errToRollbackTransaction
    }

    const runningTransaction = (this.beforeAllEntityManager)
      ? nestedTransaction(this.beforeAllEntityManager, run)
      : transaction(run)

    runningTransaction.catch((err) => {
      if (err === errToRollbackTransaction) {
        done()
      } else {
        done(err)
      }
    })
  }

  return it(expectation, transactionalAssertion)
}

const errToRollbackTransaction = new Error()
