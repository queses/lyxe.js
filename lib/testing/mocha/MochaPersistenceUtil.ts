import { TClass, TServiceId } from '../../core/di/luxe-di'
import { IDomainFixture } from '../fixture/IDomainFixture'
import { IPersistenceConnection } from '../../persistence/IPersistenceConnection'
import { AppContainer } from '../../core/di/AppContainer'
import { AppError } from '../../core/application-errors/AppError'
import { DomainFixtureLoader } from '../fixture/DomainFixtureLoader'
import { IHasId } from '../../persistence/IHasId'
import { TPersistenceConnectionName, TPersistenceId } from '../../persistence/luxe-persistence'
import { IRepository } from '../../persistence/IRepository'
import { IEntityManager } from '../../persistence/IEntityManager'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'
import { RepositoryFactoryTkn } from '../../persistence/luxe-persistence-tokens'

export class MochaPersistenceUtil {
  static repo <R extends IRepository<T, ID>, T extends IHasId<ID>, ID extends TPersistenceId> (
    id: TServiceId<R>,
    em: IEntityManager | undefined
  ) {
    return AppContainer.get(RepositoryFactoryTkn).get(id, em)
  }

  static loadFixturesIn (
    fixtures: TClass<IDomainFixture> | Array<TClass<IDomainFixture>>,
    connectionName?: TPersistenceConnectionName
  ) {
    const connection = PersistenceConnectionRegistry.get(connectionName)

    before(async function () {
      await MochaPersistenceUtil.loadFixturesBefore(fixtures, connection, this)
    })

    after(async function () {
      await MochaPersistenceUtil.rollbackBeforeAllTransaction(this)
    })
  }

  static loadModuleFixturesIn = (
    modules: string | string[],
    connectionName?: TPersistenceConnectionName
  ) => {
    const connection = PersistenceConnectionRegistry.get(connectionName)

    before(async function () {
      await MochaPersistenceUtil.loadModuleFixturesBefore(modules, connection, this)
    })

    after(async function () {
      await MochaPersistenceUtil.rollbackBeforeAllTransaction(this)
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

  private static async rollbackBeforeAllTransaction (context: Mocha.Context) {
    if (!context.currentTest || !context.currentTest.ctx) {
      return
    }

    const innerContext = context.currentTest.ctx
    if (innerContext.beforeAllEntityManager && innerContext.transactionPromise && innerContext.rollbackTransaction) {
      innerContext.rollbackTransaction()
      await innerContext.transactionPromise

      delete context.currentTest.ctx.beforeAllEntityManager
      delete context.currentTest.ctx.transactionPromise
      delete context.currentTest.ctx.rollbackTransaction
    }
  }

  private static async startBeforeAllTransaction (connection: IPersistenceConnection, context: Mocha.Context) {
    if (!connection.transaction) {
      throw new AppError('Trying to load fixtures into persistence connection which doesn\'t support transactions')
    } else if (!context.currentTest || !context.currentTest.ctx) {
      throw new AppError('MochaPersistenceUtil error: can\'t write transaction info in test context')
    }

    let fixturesLoadingFinished: () => void
    const fixturesLoadingPromise = new Promise((resolve => {
      fixturesLoadingFinished = resolve
    }))

    const innerContext = context.currentTest.ctx
    innerContext.transactionPromise = connection.transaction(async (em) => {
      innerContext.beforeAllEntityManager = em
      return new Promise((resolve, reject) => {
        innerContext.rollbackTransaction = reject
        fixturesLoadingFinished()
      })
    })

    await fixturesLoadingPromise

    return innerContext.beforeAllEntityManager as IEntityManager
  }
}