import { assert, AssertionError } from 'chai'
import { KeyValueContextStorageTkn } from '../../../lib/key-value/lyxe-key-value-tokens'
import { itInTransaction } from '../../../lib/testing/mocha/it-in-transaction'
import { TransactionalUseCase } from '../../../lib/persistence/annotations/TransactionalUseCase'
import { BaseUseCase } from '../../../lib/core/context/BaseUseCase'
import { gzip, unzip } from 'zlib'
import { promisify } from 'util'

const gzipPromise = promisify(gzip)
const unzipPromise = promisify(unzip)

describe('KeyValueContextStorage', function () {
  itInTransaction('should save and get item', async function (sf) {
    const storage = sf.createContextService(KeyValueContextStorageTkn)
    const key = 'key-value-storage-test-item-key'
    await storage.set(key, { status: 'ok' })

    assert.isTrue(await storage.has(key))

    const itemStr = await storage.get(key)
    assert.isString(itemStr)

    const item = JSON.parse(itemStr)
    assert.equal(item.status, 'ok')
  }, 'test')

  itInTransaction('should save and get date', async function (sf) {
    const storage = sf.createContextService(KeyValueContextStorageTkn)
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
    const useCase = sf.createContextService(SetItemInTransaction)

    await assert.isRejected(useCase.run(key, value), OkError)

    const storage = sf.createContextService(KeyValueContextStorageTkn)
    assert.isFalse(await storage.has(key))
  }, 'test')


  itInTransaction('should store zipped text', async function (sf) {
    const sourceStr = 'latin latin latin кириллица кириллица кириллица ²√123 ²√123 ²√123'
    const zipped = await gzipPromise(Buffer.from(sourceStr)) as Buffer
    const unzipped = await unzipPromise(zipped) as Buffer
    assert.equal(sourceStr.length, unzipped.toString().length)

    const zippedStr = zipped.toString('latin1')
    assert.isBelow(zippedStr.length, sourceStr.length)

    const storage = sf.createContextService(KeyValueContextStorageTkn)
    const key = 'key-value-storage-zip-test'
    await storage.set(key, zippedStr)

    assert.isTrue(await storage.has(key))
    const zippedStoredStr = await storage.get(key)
    assert.equal(zippedStr, zippedStoredStr)
    const unzippedStored = await unzipPromise(Buffer.from(zippedStoredStr, 'latin1')) as Buffer

    assert.equal(unzippedStored.toString().length, sourceStr.length)
  }, 'test')
})

@TransactionalUseCase(undefined, 'test')
class SetItemInTransaction extends BaseUseCase {
  public async run (key: string, value: string) {
    const keyValue = this.createContextService(KeyValueContextStorageTkn)
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
