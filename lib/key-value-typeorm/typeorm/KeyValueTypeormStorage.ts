import { EntityManager, QueryBuilder } from 'typeorm'
import { KeyValueItem } from '../model/KeyValueItem'
import { KeyValueContextStorageTkn } from '../../key-value/luxe-key-value-tokens'
import { TransientService } from '../../core/di/annotations/TransientService'
import { BaseContextService } from '../../core/context/BaseContextService'
import { IKeyValueContextStorage } from '../../key-value/IKeyValueContextStorage'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { Cached } from '../../core/lang/annotations/Cached'
import { TransactionError } from '../../core/application-errors/TransactionError'
import { PersistenceContextUtil } from '../../persistence/PersistenceContextUtil'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'

@TransientService(KeyValueContextStorageTkn)
export class KeyValueTypeormStorage extends BaseContextService implements IKeyValueContextStorage {
  public async get (key: string): Promise<string> {
    const result = await this.queryBuilder.select().where('e.key = :key', { key }).getRawOne()
    return result ? result.e_value : undefined
  }

  public async has (key: string): Promise<boolean> {
    const count = await this.queryBuilder.select().where('e.key = :key', { key }).getCount()
    return (count > 0)
  }

  public async set <T> (key: string, value: T): Promise<void> {
    let stringValue: string
    if (!key || !value) {
      throw new InvalidArgumentError('Value and key must be provided to write value in key-value storage')
    } else if (typeof value === 'function') {
      throw new InvalidArgumentError('KeyValueStorage\'s Value should not be a function')
    } else if (typeof value === 'object') {
      stringValue = JSON.stringify(value)
    } else {
      stringValue = (value as any).toString()
    }

    const item = new KeyValueItem(key, stringValue)
    await this.entityManager.save(item)
  }

  @Cached()
  private get queryBuilder (): QueryBuilder<KeyValueItem> {
    return this.entityManager.createQueryBuilder(KeyValueItem, 'e')
  }

  @Cached()
  private get entityManager () {
    const em = PersistenceContextUtil.getTransactionalEm(this) || PersistenceConnectionRegistry.get().getManager()

    if (em instanceof EntityManager) {
      return em
    } else {
      throw new TransactionError('Trying to use KeyValueTypeOrmStorage with wrong connection or in invalid transaction')
    }
  }
}
