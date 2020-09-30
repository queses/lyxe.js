import { IPersistenceConnection } from '../persistence/IPersistenceConnection'
import { Connection, ConnectionOptions, createConnection, EntityManager } from 'typeorm'
import { IEntityManager } from '../persistence/IEntityManager'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { AbstractService } from '../core/di/annotations/AbstractService'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { EntityManagerMeta } from '../persistence/EntityManagerMeta'
import { PersistenceTypeormConfig } from './PersistenceTypeormConfig'
import { TPersistenceConnectionName } from '../persistence/lyxe-persistence'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { AppEnv } from '../core/config/AppEnv'
import { InjectService } from '../core/di/annotations/InjectService'
import { TransactionEventBusTkn } from '../persistence/lyxe-persistence-tokens'
import { ITransactionEvenBus } from '../persistence/ITransactionEvenBus'
import { TypeormTransactionManager } from './TypeormTransactionManager'

@AbstractService()
export abstract class BaseTypeormConnection implements IPersistenceConnection {
  @InjectService(TransactionEventBusTkn)
  private transactionListener: ITransactionEvenBus

  @InjectService(TypeormTransactionManager)
  private transactionManager: TypeormTransactionManager

  public abstract get config (): ConnectionOptions
  protected abstract get persistenceConnectionName (): TPersistenceConnectionName

  private connection?: Connection

  public async connect (): Promise<void> {
    this.connection = await createConnection(this.config)
  }

  public async close (): Promise<void> {
    if (this.connection && this.connection.isConnected) {
      await this.connection.close()
    }
  }

  public getManager (): IEntityManager {
    if (!this.connection) {
      throw new AppConfigurationError('Trying to get entity manager with closed connection ' + this.constructor.name)
    }

    const em = this.connection.createEntityManager()
    Reflect.defineMetadata(EntityManagerMeta.CONNECTION, this, em)

    return em as IEntityManager
  }

  public clearStorage (): Promise<void> {
    if (!this.connection) {
      throw new AppConfigurationError('Trying to clear storage with closed connection ' + this.constructor.name)
    }

    return this.connection.synchronize(true)
  }

  async beginTransaction (currentTransactionEntityManager?: IEntityManager): Promise<IEntityManager> {
    if (!this.connection) {
      await this.connect()
    }

    let entityManager: EntityManager
    if (!currentTransactionEntityManager) {
      entityManager = await this.transactionManager.begin(this.connection as Connection)
      Reflect.defineMetadata(EntityManagerMeta.TRANSACTION_STARTER, entityManager, entityManager)
    } else {
      entityManager = await this.transactionManager.beginNested(this.checkEntityManager(currentTransactionEntityManager))
      Reflect.defineMetadata(EntityManagerMeta.TRANSACTION_STARTER, currentTransactionEntityManager, entityManager)
    }

    Reflect.defineMetadata(EntityManagerMeta.CONNECTION, this, entityManager)

    return entityManager as IEntityManager
  }

  public async commitTransaction (entityManager: IEntityManager): Promise<void> {
    await this.transactionManager.commit(this.checkEntityManager(entityManager))
    this.transactionListener.handleCommit(entityManager)
  }

  public async rollbackTransaction (entityManager: IEntityManager): Promise<void> {
    await this.transactionManager.rollback(this.checkEntityManager(entityManager))
    this.transactionListener.handleRollback(entityManager)
  }

  protected getDbEntities (onlyInModules?: string[]) {
    let modulesWildCard
    if (Array.isArray(onlyInModules)) {
      modulesWildCard = `+(${onlyInModules.join('|')})`
    } else {
      modulesWildCard = '*'
    }

    const fileExt = AppPathUtil.codeExtWildcard
    const srcDir = AppPathUtil.appSrc
    const patches = [ `${srcDir}/${modulesWildCard}/domain/model/*${fileExt}` ]

    if (AppEnv.inTest) {
      patches.push(`${srcDir}/${modulesWildCard}/tests/model/*${fileExt}`)
    }

    const extraEntities = PersistenceTypeormConfig.inst.connectionExtraEntities.get(this.persistenceConnectionName) || []
    for (const path of extraEntities) {
      patches.push(path + `/*${fileExt}`)
    }

    return patches
  }

  private checkEntityManager (em: IEntityManager): EntityManager {
    const connection: this | undefined = Reflect.getMetadata(EntityManagerMeta.CONNECTION, em)
    if (em instanceof EntityManager && connection instanceof this.constructor) {
      return em
    } else {
      throw new InvalidArgumentError('Wrong IEntityManager implementation passed to TypeORM PersistenceConnection')
    }
  }
}
