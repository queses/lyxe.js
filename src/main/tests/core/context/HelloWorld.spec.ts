import { assert } from 'chai'
import { AppContainer } from '../../../../../lib/core/di/AppContainer'
import { HelloWorldUseCaseTkn } from '../../../test-tokens'

describe('HelloWorld', function () {
  it('should return hello world', async function () {
    assert.equal(await AppContainer.get(HelloWorldUseCaseTkn).run(), 'Hello Word from UseCase!')
  })
})
