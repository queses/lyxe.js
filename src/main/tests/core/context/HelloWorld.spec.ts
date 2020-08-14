import { assert } from 'chai'
import { HelloWorldUseCaseTkn } from '../../../test-tokens'
import { AppContainer } from '../../../../lib/core/di/AppContainer'

describe('HelloWorld', function () {
  it('should return hello world', async function () {
    assert.equal(await AppContainer.get(HelloWorldUseCaseTkn).run(), 'Hello Word from UseCase!')
  })
})
