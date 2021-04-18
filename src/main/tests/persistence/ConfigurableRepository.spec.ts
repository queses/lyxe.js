import { assert } from 'chai'
import { TestSpecialist } from '../../domain/model/TestSpecialist'
import { ConfigurableTestSpecialistRepoTkn } from '../../test-tokens'
import { TestSpecialistSearchConf } from '../../domain/model/TestSpecialistSearchConf'
import { itInTransaction } from '../../../lib/testing/mocha/it-in-transaction'
import { TestUtil } from '../../../lib/testing/TestUtil'
import { PageConfig } from '../../../lib/persistence/PageConfig'

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

  itInTransaction('should find entities by condition', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const opts: TestSpecialistSearchConf = new TestSpecialistSearchConf(new PageConfig(9, 1)).sortFirstName()

    const page = await repo.findWhereFirstNameLike('%e%', opts)
    assert.lengthOf(page, 2)
    assert.equal(page[0].getFirstName(), 'Abbey')
    assert.equal(page[1].getFirstName(), 'Ben')

    opts.searchAlsoDeleted()
    const deletedPage = await repo.findWhereFirstNameLike('%e%', opts)
    assert.lengthOf(deletedPage, 3)
  }, 'test')

  itInTransaction('should count entities', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities())
    const opts: TestSpecialistSearchConf = new TestSpecialistSearchConf(new PageConfig(2))

    const count = await repo.countWhereLastNameStartsWith('W', opts)
    assert.equal(count, 3)

    opts.searchAlsoDeleted()
    const withDeletedCount = await repo.countWhereLastNameStartsWith('W', opts)
    assert.equal(withDeletedCount, 4)
  }, 'test')

  itInTransaction('should find by ids', async function (sf, em) {
    const repo = TestUtil.createRepo(ConfigurableTestSpecialistRepoTkn, em)
    await repo.saveMany(createEntities().concat())

    const all = await repo.findAll(new TestSpecialistSearchConf().searchAlsoDeleted())
    const byIds = await repo.findByIds(all.map(entity => entity.getId()))
    const indexOfDeleted = all.findIndex(entity => entity.getFirstName() === 'Deleted')

    assert.lengthOf(byIds, 4)
    assert.isUndefined(byIds[indexOfDeleted])
  }, 'test')
})

const createEntities = () => {
  return [
    TestSpecialist.create('Ben', 'Williams'),
    TestSpecialist.create('Carrol', 'Williams'),
    TestSpecialist.create('Abbey', 'Williams'),
    TestSpecialist.create('Deleted', 'Williams').delete()
  ]
}
