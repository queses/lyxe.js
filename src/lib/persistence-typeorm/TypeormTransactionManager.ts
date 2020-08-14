import { IEntityManager } from '../persistence/IEntityManager'
import { Connection, EntityManager, QueryRunner } from 'typeorm'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel'
import { TypeormTransactionPoolRegistry } from './TypeormTransactionPoolRegistry'
import { TransactionError } from '../core/application-errors/TransactionError'
import { TypeormSqlSavepointManager } from './TypeormSqlSavepointManager'

@SingletonService()
export class TypeormTransactionManager {
  beginNonStrict (connection: Connection) {
    return this.begin(connection, 'READ UNCOMMITTED')
  }

  beginWithIsolation (level: IsolationLevel, connection: Connection) {
    return this.begin(connection, level)
  }

  public async begin (connection: Connection, isolationLevel?: IsolationLevel) {
    const runner = await this.createQueryRunner(connection)
    await runner.startTransaction(isolationLevel)
    const poolId = TypeormTransactionPoolRegistry.register(runner)

    return this.writeEntityMgrMetadata(runner.manager, poolId)
  }

  public async beginNested (entityManager: EntityManager) {
    const poolId = this.getManagerMetadataRunnerId(entityManager)
    if (!poolId) {
      throw new InvalidArgumentError('Non-transactional entity manager passed to begin transaction method')
    }

    const runner = TypeormTransactionPoolRegistry.get(poolId)

    if (!runner) {
      return entityManager
    } else if (entityManager.connection.name !== runner.connection.name) {
      throw new TransactionError('Trying to begin nested transaction with entity manager, that refers to other connection')
    }

    const savepointId = await this.getSavepointManager(runner).createSavepoint(runner)
    const newEntityManager = runner.connection.createEntityManager(runner)
    return this.writeEntityMgrMetadata(newEntityManager, poolId, savepointId)
  }

  async commit (entityManager: EntityManager): Promise<void> {
    const poolId = this.getManagerMetadataRunnerId(entityManager)
    if (isNaN(poolId)) {
      throw new TransactionError('Entity manager passed to commit transaction method isn\'t in transaction')
    }

    const runner = TypeormTransactionPoolRegistry.get(poolId)
    if (!runner) {
      throw new TransactionError('No query runner found for entity manager while transaction commit')
    }

    const savepointId = this.getManagerMetadataSavepointId(entityManager)
    if (savepointId) {
      await this.getSavepointManager(runner).commit(savepointId, runner)
    } else {
      TypeormTransactionPoolRegistry.clear(poolId)
      await this.commitRunnerTransaction(runner)
    }
  }

  async rollback (entityManager: EntityManager): Promise<void> {
    const poolId = this.getManagerMetadataRunnerId(entityManager)
    if (isNaN(poolId)) {
      return
    }

    const runner = TypeormTransactionPoolRegistry.get(poolId)
    if (!runner) {
      throw new TransactionError('No query runner found for entity manager while transaction rollback')
    }

    const savepointId = this.getManagerMetadataSavepointId(entityManager)
    if (savepointId) {
      await this.getSavepointManager(runner).rollbackTo(savepointId, runner)
    } else {
      TypeormTransactionPoolRegistry.clear(poolId)
      await this.rollbackRunnerTransaction(runner)
    }
  }

  async rollbackAll (): Promise<void> {
    const runners = TypeormTransactionPoolRegistry.getAll()
    await Promise.all(Object.keys(runners).map((key: string) => {
      const runnerId = parseInt(key, 10)
      const runner = runners[runnerId]
      TypeormTransactionPoolRegistry.clear(runnerId)
      return this.rollbackRunnerTransaction(runner)
    }))
  }

  public getTransactionId (entityManager: IEntityManager): number | undefined {
    if (!(entityManager instanceof EntityManager)) {
      throw new InvalidArgumentError('Cannot get TypeORM transaction id: EntityManager is invalid')
    }

    const id = this.getManagerMetadataRunnerId(entityManager)
    return (isNaN(id)) ? undefined : id
  }

  private async createQueryRunner (connection: Connection) {
    const runner = connection.createQueryRunner()
    await runner.connect()
    return runner
  }

  private async commitRunnerTransaction (queryRunner: QueryRunner) {
    await queryRunner.commitTransaction()
    await queryRunner.release()
  }

  private async rollbackRunnerTransaction (queryRunner: QueryRunner) {
    await queryRunner.rollbackTransaction()
    await queryRunner.release()
  }

  private getSavepointManager (queryRunner: QueryRunner) {
    const dbType: string = queryRunner.connection.driver.options.type
    if (
      dbType === 'mysql' ||
      dbType === 'mariadb' ||
      dbType === 'postgres' ||
      dbType === 'cockroachdb' ||
      dbType === 'sqlite' ||
      dbType === 'oracle'
    ) {
      return TypeormSqlSavepointManager.inst
    }

    throw new TransactionError(`No nested transaction manager implemented for ${dbType} database`)
  }

  private writeEntityMgrMetadata (manager: EntityManager, runnerId: number, savepointId?: string) {
    Reflect.defineMetadata(ManagerMeta.RUNNER_ID, runnerId, manager)
    if (savepointId) {
      Reflect.defineMetadata(ManagerMeta.SAVEPOINT_ID, savepointId, manager)
    }
    return manager
  }

  private getManagerMetadataRunnerId (manager: EntityManager): number {
    return parseInt(Reflect.getMetadata(ManagerMeta.RUNNER_ID, manager), 10)
  }

  private getManagerMetadataSavepointId (manager: EntityManager): string {
    return Reflect.getMetadata(ManagerMeta.SAVEPOINT_ID, manager)
  }
}

enum ManagerMeta {
  RUNNER_ID = 'typedi-transaction:runner-id',
  SAVEPOINT_ID = 'typedi-transaction:savepoint-id'
}