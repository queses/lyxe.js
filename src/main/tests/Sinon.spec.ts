import * as sinon from 'sinon'
import { assert } from 'chai'
import { AppContainer } from '../../../lib/core/di/AppContainer'
import { HelloWorldUseCaseTkn } from '../test-tokens'

describe('sinon', function () {
  it('should replace Date.now', function () {
    const constDate = new Date('01.01.2019 12:00')
    sinon.replace(Date, 'now', sinon.fake.returns(constDate.getTime()))

    assert.equal(Date.now(), constDate.getTime())
  })

  it('should replace current time', function () {
    /**
     * Если это будет ломать другие тесты, есть способ, как заменить new Date() с помощью fake:
     * https://github.com/facebook/jest/issues/2234
     */
    const constDate = new Date('01.01.2019 12:00')
    sinon.useFakeTimers(constDate)
    assert.equal(new Date().getTime(), constDate.getTime())
  })

  it('should return current time', function () {
    const constDate = new Date('01.01.2019 12:00')
    assert.notEqual(new Date().getTime(), constDate.getTime())
  })

  it('should replace method in domain service', async function () {
    const service = AppContainer.get(HelloWorldUseCaseTkn)
    sinon.replace(service.constructor.prototype, 'run', async () => 'Fake Hello World from UseCase!')

    const serviceAgain = AppContainer.get(HelloWorldUseCaseTkn)
    assert.equal(await serviceAgain.run(), 'Fake Hello World from UseCase!')
    
    sinon.restore()
    assert.notEqual(await serviceAgain.run(), 'Fake Hello World from UseCase!')
  })
})
