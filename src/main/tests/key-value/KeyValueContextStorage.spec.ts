import { assert, AssertionError } from 'chai'
import { itInTransaction } from '../../../../libsrc/testing/mocha/it-in-transaction'
import { KeyValueContextStorageTkn } from '../../../../libsrc/key-value/luxie-key-value-tokens'
import { TransactionalUseCase } from '../../../../libsrc/persistence/annotations/TransactionalUseCase'
import { BaseUseCase } from '../../../../libsrc/core/context/BaseUseCase'

describe('KeyValueContextStorage', function () {
  itInTransaction('should save and get item', async function (sf) {
    const storage = sf.createService(KeyValueContextStorageTkn)
    const key = 'key-value-storage-test-item-key'
    await storage.set(key, { status: 'ok' })

    assert.isTrue(await storage.has(key))

    const itemStr = await storage.get(key)
    assert.isString(itemStr)

    const item = JSON.parse(itemStr)
    assert.equal(item.status, 'ok')
  }, 'test')

  itInTransaction('should save and get date', async function (sf) {
    const storage = sf.createService(KeyValueContextStorageTkn)
    const key = 'key-value-storage-test-date-key'
    const sourceDate = new Date()
    await storage.set(key, sourceDate)

    assert.isTrue(await storage.has(key))

    const itemStr = await storage.get(key)
    assert.isString(itemStr)

    const storageDate = new Date(JSON.parse(itemStr))
    assert.equal(storageDate.getTime(), sourceDate.getTime())
  }, 'test')

  itInTransaction('should work in nested transaction', async function (sf) {
    const key = 'key-value-storage-test-date-key'
    const value = 'something'
    const useCase = sf.createUseCase(SetItemInTransaction)

    await assert.isRejected(useCase.run(key, value), OkError)

    const storage = sf.createService(KeyValueContextStorageTkn)
    assert.isFalse(await storage.has(key))
  }, 'test')
})

@TransactionalUseCase(undefined, 'test')
class SetItemInTransaction extends BaseUseCase {
  public async run (key: string, value: string) {
    const keyValue = this.createService(KeyValueContextStorageTkn)
    await keyValue.set(key, value)

    if (await keyValue.get(key) !== value) {
      throw new AssertionError('Values should be equal')
    } else {
      throw new OkError()
    }
  }
}

// Error to rollback transaction
class OkError extends Error {}
