import { TClass } from '../../core/di/lyxe-di'
import { IDomainFixture } from '../fixture/IDomainFixture'
import { IPersistenceConnection } from '../../persistence/IPersistenceConnection'
import { AppContainer } from '../../core/di/AppContainer'
import { AppError } from '../../core/application-errors/AppError'
import { DomainFixtureLoader } from '../fixture/DomainFixtureLoader'
import { IHasId } from '../../persistence/IHasId'
import { TPersistenceConnectionName, TPersistenceId } from '../../persistence/lyxe-persistence'
import { IRepository } from '../../persistence/IRepository'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'
import { TransactionError } from '../../core/application-errors/TransactionError'

export class MochaFixtureUtil {
  static loadFixturesIn (
    fixtures: TClass<IDomainFixture> | Array<TClass<IDomainFixture>>,
    connectionName?: TPersistenceConnectionName
  ) {
    before(async function () {
      const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
      await MochaFixtureUtil.loadFixturesBefore(fixtures, connection, this)
    })

    after(async function () {
      const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
      await MochaFixtureUtil.rollbackBeforeAllTransaction(connection, this)
    })
  }

  static loadModuleFixturesIn = (modules: string | string[], connectionName?: TPersistenceConnectionName) => {
    before(async function () {
      const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
      await MochaFixtureUtil.loadModuleFixturesBefore(modules, connection, this)
    })

    after(async function () {
      const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
      await MochaFixtureUtil.rollbackBeforeAllTransaction(connection, this)
    })
  }

  static async saveAndRefreshEntity <E extends IHasId<ID>, ID extends TPersistenceId> (
    entity: E,
    repo: IRepository<E, ID>
  ) {
    await repo.save(entity)
    return await repo.findById(entity.getId())
  }

  private static async loadFixturesBefore (
    fixtures: TClass<IDomainFixture> | Array<TClass<IDomainFixture>>,
    connection: IPersistenceConnection,
    context: Mocha.Context
  ) {
    const em = await this.startBeforeAllTransaction(connection, context)
    await AppContainer.get(DomainFixtureLoader).load(fixtures, em)
  }

  private static async loadModuleFixturesBefore (
    modules: string | string[],
    connection: IPersistenceConnection,
    context: Mocha.Context
  ) {
    const em = await this.startBeforeAllTransaction(connection, context)
    await AppContainer.get(DomainFixtureLoader).loadInModules(Array.isArray(modules) ? modules : [ modules ], em)
  }

  private static async rollbackBeforeAllTransaction (connection: IPersistenceConnection, context: Mocha.Context) {
    if (!context.currentTest || !context.currentTest.ctx) {
      return
    }
    
    const innerContext = context.currentTest.ctx
    if (!innerContext.beforeAllEntityManager) {
      return
    } else if (!connection.rollbackTransaction) {
      throw new TransactionError('MochaPersistenceUtil error: cannot rollback test function with provided connection')
    }

    await connection.rollbackTransaction(innerContext.beforeAllEntityManager)
    delete innerContext.beforeAllEntityManager
  }

  private static async startBeforeAllTransaction (connection: IPersistenceConnection, context: Mocha.Context) {
    if (!connection.beginTransaction) {
      throw new AppError('Trying to load fixtures into persistence connection which doesn\'t support transactions')
    } else if (!context.currentTest || !context.currentTest.ctx) {
      throw new AppError('MochaPersistenceUtil error: can\'t write transaction info in test function context')
    }

    const transactionalEm = await connection.beginTransaction()
    context.currentTest.ctx.beforeAllEntityManager = transactionalEm

    return transactionalEm
  }
}
