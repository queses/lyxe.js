import { assert } from 'chai'
import Token from '../../../../lib/core/di/Token'
import { ContainerInstance } from '../../../../lib/core/di/ContainerInstance'
import { AbstractService } from '../../../../lib/core/di/annotations/AbstractService'

describe('ContainerInstance', function () {
  it('should replace current service', function () {
    const token = new Token('ExampleService')

    @AbstractService()
    class OldService {}

    @AbstractService()
    class NewService {}

    const container = new ContainerInstance()
    container.setSingleton(token, OldService)
    assert.instanceOf(container.get(token), OldService)
    container.replaceSingleton(token, NewService)
    assert.instanceOf(container.get(token), NewService)
  })
})

