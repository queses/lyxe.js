import { TMochaTransactionalTest } from '../framework-testing'
import { TBaseContextInfo } from '../../core/context/lyxe-context-info'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { TPersistenceConnectionName } from '../../persistence/lyxe-persistence'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'
import { TestUtil } from '../TestUtil'
import { AppContainer } from '../../core/di/AppContainer'

export const itInTransaction = <C extends TBaseContextInfo> (
  expectation: string,
  assertion: TMochaTransactionalTest<C>,
  connectionName?: TPersistenceConnectionName
) => {
  const transactionalAssertion = async function (this: Mocha.Test & any) {
    const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
    if (!connection.beginTransaction || !connection.rollbackTransaction) {
      throw new InvalidArgumentError('itInTransaction error: provided connection is not transactional')
    }

    const transactionalEm = await connection.beginTransaction(this.beforeAllEntityManager)
    if (!this.contextInfo) {
      this.contextInfo = {}
    }

    try {
      await assertion.call(this, TestUtil.createServiceFactory<C>(transactionalEm), transactionalEm)
    } finally {
      await connection.rollbackTransaction(transactionalEm)
    }
  }

  return it(expectation, transactionalAssertion)
}
