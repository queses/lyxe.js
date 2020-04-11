import { assert } from 'chai'
import { itInTransaction } from '../../../../lib/testing/mocha/it-in-transaction'
import { TestSpecialist } from '../../domain/model/TestSpecialist'
import { IRepository } from '../../../../lib/persistence/IRepository'
import { TestSpecialistRepoTkn } from '../../test-tokens'
import { TestUtil } from '../../../../lib/testing/TestUtil'

describe('BaseRepository', function () {
  itInTransaction('should find all entities', async function (sf, em) {
    const repo = TestUtil.createRepo(TestSpecialistRepoTkn, em)
    await saveEntities(repo)

    const collection = await repo.findAll()
    assert.lengthOf(collection, 11)

    collection.forEach((spec) => {
      assert.instanceOf(spec, TestSpecialist)
      assert.isString(spec.getFirstName())
    })
  }, 'test')

  itInTransaction('should save entity', async function (sf, em) {
    const repo = TestUtil.createRepo(TestSpecialistRepoTkn, em)
    const specialist = TestSpecialist.create('Test', 'Testy')

    assert.isTrue(await repo.save(specialist) instanceof TestSpecialist)
    assert.isTrue(await repo.existsById(specialist.getId()))
  }, 'test')

  itInTransaction('should update entity', async function (sf, em) {
    const repo = TestUtil.createRepo(TestSpecialistRepoTkn, em)
    const specialist = TestSpecialist.create('Test', 'Testy')
    await repo.save(specialist)

    specialist.changeFirstName('Mocha')
    await repo.save(specialist)

    const specialistFromDb = await repo.findById(specialist.getId()) as TestSpecialist
    assert.isObject(specialistFromDb)
    assert.equal(specialistFromDb.getFirstName(), 'Mocha')
  }, 'test')

  itInTransaction('should find entity', async function (sf, em) {
    const repo = TestUtil.createRepo(TestSpecialistRepoTkn, em)
    await repo.saveMany([
      TestSpecialist.create('Test', 'Testy'),
      TestSpecialist.create('Good', 'Boi'),
      TestSpecialist.create('James', 'Jameson')
    ])

    assert.equal(await repo.count(), 3)
    
    const like = await repo.findWhereFirstNameLike('Jam')
    assert.lengthOf(like, 1)
    assert.equal(like[0].getFirstName(), 'James')
  }, 'test')
})

const saveEntities = (repo: IRepository<TestSpecialist, number>) => {
  return repo.saveMany([
    TestSpecialist.create('Test', 'Testy'),
    TestSpecialist.create('Salvatore', 'Tessio'),
    TestSpecialist.create('James', 'Jameson'),
    TestSpecialist.create('Test', 'Smith'),
    TestSpecialist.create('Test', 'Coleman'),
    TestSpecialist.create('Test', 'Freeman'),
    TestSpecialist.create('Test', 'Bates'),
    TestSpecialist.create('Test', 'Kimmel'),
    TestSpecialist.create('Test', 'Jersey'),
    TestSpecialist.create('Test', 'Lessley'),
    TestSpecialist.create('Test', 'Sunman')
  ])
}
