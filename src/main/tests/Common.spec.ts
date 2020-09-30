import { assert } from 'chai'
import { AppError } from '../../lib/core/application-errors/AppError'

describe('Common', function () {
  it('should set metadata', function () {
    const object = new Date()

    Reflect.defineMetadata('test:point', 42, object)
    assert.equal(Reflect.getMetadata('test:point', object), 42)
    
    const newObject = new Date()
    assert.isUndefined(Reflect.getMetadata('test:point', newObject))
  })

  it('should assert promise rejection', async function () {
    await assert.isRejected(Promise.reject(new AppError('Bad thing happened!')), AppError)
  })
})
