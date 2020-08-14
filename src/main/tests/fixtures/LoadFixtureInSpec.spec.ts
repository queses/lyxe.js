import { assert } from 'chai'
import { TestSpecialistAccountFixture } from './TestSpecialistAccountFixture'
import { TestSpecialistAccountRepoTkn } from '../../test-tokens'
import { MochaFixtureUtil } from '../../../lib/testing/mocha/MochaFixtureUtil'
import { itInTransaction } from '../../../lib/testing/mocha/it-in-transaction'
import { TestUtil } from '../../../lib/testing/TestUtil'

describe('LoadFixtureInSpec', function () {
  MochaFixtureUtil.loadFixturesIn(TestSpecialistAccountFixture, 'test')

  itInTransaction('should count loaded fixtures', async function (sf, em) {
    const repo = TestUtil.createRepo(TestSpecialistAccountRepoTkn, em)
    assert.isAbove(await repo.count(), 0)
  }, 'test')
})
