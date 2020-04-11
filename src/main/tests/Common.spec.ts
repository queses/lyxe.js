import { assert } from 'chai'

describe('framework common', function () {
  it('should set metadata', function () {
    const object = new Date()

    Reflect.defineMetadata('test:point', 42, object)
    assert.equal(Reflect.getMetadata('test:point', object), 42)
    
    const newObject = new Date()
    assert.isUndefined(Reflect.getMetadata('test:point', newObject))
  })
})
