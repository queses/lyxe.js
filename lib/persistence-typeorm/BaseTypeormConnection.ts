import { IPersistenceConnection } from '../persistence/IPersistenceConnection'
import { Connection, ConnectionOptions, createConnection, EntityManager } from 'typeorm'
import { IEntityManager } from '../persistence/IEntityManager'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { AbstractService } from '../core/di/annotations/AbstractService'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { EntityManagerMeta } from '../persistence/EntityManagerMeta'
import { PersistenceTypeormConfig } from './PersistenceTypeormConfig'
import { TPersistenceConnectionName } from '../persistence/luxe-persistence'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { AppEnv } from '../core/config/AppEnv'
import { InjectService } from '../core/di/annotations/InjectService'
import { TransactionEventBusTkn } from '../persistence/luxe-persistence-tokens'
import { ITransactionEvenBus } from '../persistence/ITransactionEvenBus'

@AbstractService()
export abstract class BaseTypeormConnection implements IPersistenceConnection {
  @InjectService(TransactionEventBusTkn)
  private transactionListener: ITransactionEvenBus

  public abstract get config (): ConnectionOptions
  protected abstract get persistenceConnectionName (): TPersistenceConnectionName
  private connection?: Connection

  public async close (): Promise<void> {
    if (this.connection) {
      await this.connection.close()
    }
  }

  public async connect (): Promise<void> {
    this.connection = await createConnection(this.config)
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

  public async transaction <T> (run: (transactional: IEntityManager) => Promise<T>): Promise<T> {
    if (!this.connection) {
      await this.connect()
    }

    return (this.connection as Connection).transaction(async transactional => {
      Reflect.defineMetadata(EntityManagerMeta.CONNECTION, this, transactional)
      Reflect.defineMetadata(EntityManagerMeta.TRANSACTION_STARTER, transactional, transactional)

      let result: any
      try {
        result = await run(transactional as IEntityManager)
      } catch (e) {
        this.transactionListener.handleRollback(transactional as IEntityManager)
        throw e
      }

      this.transactionListener.handleCommit(transactional as IEntityManager)
      return result
    })
  }

  public nestedTransaction <T> (parent: IEntityManager, run: (transactional: IEntityManager) => Promise<T>): Promise<T> {
    const em = this.checkTransactionalEntityManager(parent)
    return em.transaction(transactional => {
      Reflect.defineMetadata(EntityManagerMeta.CONNECTION, this, transactional)
      const transactionStarter = Reflect.getMetadata(EntityManagerMeta.TRANSACTION_STARTER, parent)
      Reflect.defineMetadata(EntityManagerMeta.TRANSACTION_STARTER, transactionStarter, transactional)

      return run(transactional as IEntityManager)
    })
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
      patches.push(path)
    }

    return patches
  }

  private checkTransactionalEntityManager (em: IEntityManager): EntityManager {
    if (
      em instanceof EntityManager &&
      Reflect.getMetadata(EntityManagerMeta.CONNECTION, em) instanceof this.constructor
    ) {
      return em
    } else {
      throw new InvalidArgumentError('Wrong IEntityManager implementation passed to TypeormConnection')
    }
  }
}