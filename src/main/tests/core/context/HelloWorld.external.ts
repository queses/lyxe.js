import { assert } from 'chai'
import { HelloWorldUseCaseTkn } from '../../../test-tokens'
import { AppContainer } from '../../../../lib/core/di/AppContainer'

describe('HelloWorldExternal', function () {
  this.slow()

  it('should return slow hello world', async function () {
    await new Promise(r => setTimeout(r, 500))
    assert.equal(await AppContainer.get(HelloWorldUseCaseTkn).run(), 'Hello Word from UseCase!')
  })
})
