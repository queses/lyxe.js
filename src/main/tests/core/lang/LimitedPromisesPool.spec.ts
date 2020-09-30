import { LimitedPromisesPool } from '../../../../lib/core/lang/LimitedPromisesPool'
import { PromiseUtil } from '../../../../lib/core/lang/PromiseUtil'
import { assert } from 'chai'
import { AppError } from '../../../../lib/core/application-errors/AppError'

describe('LimitedPromisesPool', function () {
  it('should limit promises', async function () {
    let addedCounter = 0
    let resolvedCounter = 0
    const createPromise = () => {
      addedCounter++
      return PromiseUtil.sleep(6).then(() => { resolvedCounter++ })
    }

    const pool = new LimitedPromisesPool(3)
    pool.add(createPromise)
    assert.equal(addedCounter, 1)
    pool.add(createPromise)
    assert.equal(addedCounter, 2)
    pool.add(createPromise)
    assert.equal(addedCounter, 3)
    pool.add(createPromise)
    assert.equal(addedCounter, 3)
    assert.equal(resolvedCounter, 0)

    await PromiseUtil.sleep(10)
    assert.isTrue(pool.hasPending)
    assert.equal(addedCounter, 4)
    assert.equal(resolvedCounter, 3)

    await PromiseUtil.sleep(10)
    assert.equal(addedCounter, 4)
    assert.equal(resolvedCounter, 4)
    assert.isFalse(pool.hasPending)
  })

  it('should add promise next after resolved', async function () {
    let addedCounter = 0
    let resolvedCounter = 0
    const createFastPromise = () => {
      addedCounter++
      return PromiseUtil.sleep(3).then(() => { resolvedCounter++ })
    }

    const createSlowPromise = () => {
      addedCounter++
      return PromiseUtil.sleep(7).then(() => { resolvedCounter++ })
    }

    const pool = new LimitedPromisesPool(2)
    pool.add(createFastPromise)
    assert.equal(addedCounter, 1)
    pool.add(createSlowPromise)
    assert.equal(addedCounter, 2)
    pool.add(createFastPromise)
    assert.equal(addedCounter, 2)
    pool.add(createSlowPromise)
    assert.equal(addedCounter, 2)
    assert.equal(resolvedCounter, 0)

    await PromiseUtil.sleep(5)
    assert.equal(addedCounter, 3)
    assert.equal(resolvedCounter, 1)

    await PromiseUtil.sleep(5)
    assert.equal(addedCounter, 4)
    assert.equal(resolvedCounter, 3)

    await PromiseUtil.sleep(5)
    assert.equal(addedCounter, 4)
    assert.equal(resolvedCounter, 4)
  })

  it('should add wait all promises', async function () {
    let resolvedCounter = 0
    const createPromise = () => {
      return PromiseUtil.sleep(6).then(() => { resolvedCounter++ })
    }

    const pool = new LimitedPromisesPool(3)
    pool.add(createPromise)
    pool.add(createPromise)
    pool.add(createPromise)
    pool.add(createPromise)

    await PromiseUtil.timeoutExecution(pool.waitForAll(), 'waiting', 50)
    assert.equal(resolvedCounter, 4)
  })

  it('should catch error', async function () {
    let rejectedCounter = 0
    const createErrorPromise = () => {
      return PromiseUtil.sleep(3).then(() => { throw new AppError() })
    }

    const pool = new LimitedPromisesPool(1)
    pool.add(createErrorPromise, () => { rejectedCounter++ })
    pool.add(createErrorPromise, () => { rejectedCounter++ })
    assert.equal(rejectedCounter, 0)

    await PromiseUtil.sleep(5)
    assert.equal(rejectedCounter, 1)

    await PromiseUtil.sleep(5)
    assert.equal(rejectedCounter, 2)
  })
})