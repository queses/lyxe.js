import { assert } from 'chai'
import { itInTransaction } from '../../../../libsrc/testing/mocha/it-in-transaction'
import { TestSpecialist } from '../../domain/model/TestSpecialist'
import { ConfigurableTestSpecialistRepoTkn } from '../../test-tokens'
import { TestSpecialistSearchConf } from '../../domain/model/TestSpecialistSearchConf'
import { PageConfig } from '../../../../libsrc/persistence/PageConfig'
import { TestUtil } from '../../../../libsrc/testing/TestUtil'

describe('ConfigurableRepository', function () {
  itInTransaction('should sort entities', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const list = await repo.findAll(new TestSpecialistSearchConf().sortFirstName())

    assert.lengthOf(list, 3)
    assert.equal(list[0].getFirstName(), 'Abbey')
    assert.equal(list[2].getFirstName(), 'Carrol')
  }, 'test')

  itInTransaction('should paginate entities', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const page = await repo.findAll(new TestSpecialistSearchConf(new PageConfig(2)))

    assert.lengthOf(page, 2)
    assert.equal(page.totalElements, 3)
    assert.equal(page.totalPages, 2)

    const pageTwo = await repo.findAll(new TestSpecialistSearchConf(new PageConfig(2, 2)))

    assert.lengthOf(pageTwo, 1)
    assert.equal(pageTwo.totalElements, 3)
    assert.equal(pageTwo.totalPages, 2)
  }, 'test')

  itInTransaction('should sort and paginate entities', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const page = await repo.findAll(new TestSpecialistSearchConf(new PageConfig(2, 2)).sortFirstNameDesc())

    assert.lengthOf(page, 1)
    assert.equal(page.totalElements, 3)
    assert.equal(page.totalPages, 2)
    assert.equal(page[0].getFirstName(), 'Abbey')
  }, 'test')

  itInTransaction('should find entity', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const opts: TestSpecialistSearchConf = new TestSpecialistSearchConf(new PageConfig(2, 1)).sortFirstName()

    const page = await repo.findWhereFirstNameLike('%b%', opts)
    assert.lengthOf(page, 2)
    assert.equal(page[0].getFirstName(), 'Abbey')
    assert.equal(page[1].getFirstName(), 'Bob')

    opts.onlyInactive = true
    const inactivePage = await repo.findWhereFirstNameLike('%b%', opts)
    assert.lengthOf(inactivePage, 0)
  }, 'test')

  itInTransaction('should count entities', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const opts: TestSpecialistSearchConf = new TestSpecialistSearchConf(new PageConfig(2))

    const count = await repo.countWhereLastNameStartsWith('W', opts)
    assert.equal(count, 3)

    opts.searchOnlyInactive()
    const inactiveCount = await repo.countWhereLastNameStartsWith('W', opts)
    assert.equal(inactiveCount, 0)
  }, 'test')
})

const createEntities = () => {
  return [
    TestSpecialist.create('Bob', 'Williams'),
    TestSpecialist.create('Carrol', 'Williams'),
    TestSpecialist.create('Abbey', 'Williams')
  ]
}
