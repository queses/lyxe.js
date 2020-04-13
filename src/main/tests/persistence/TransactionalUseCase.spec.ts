import { assert, AssertionError } from 'chai'
import { ParentTransactionalUseCaseTkn, TestSpecialistAccountRepoTkn, TestSpecialistRepoTkn } from '../../test-tokens'
import { PersistenceConnectionRegistry } from '../../../../lib/persistence/PersistenceConnectionRegistry'
import { TestUtil } from '../../../../lib/testing/TestUtil'
import { AppContainer } from '../../../../lib/core/di/AppContainer'

describe('TransactionalUseCase', function () {
  it('should begin and rollback transactional use case', async function () {
    const specRepo = TestUtil.createRepo(TestSpecialistAccountRepoTkn, undefined)
    const oldCount = await specRepo.count()

    const useCase = TestUtil.createContextService(ParentTransactionalUseCaseTkn, undefined)
    try {
      await useCase.run(true)
    } catch (err) {
      // Transaction was rollback'd
    }

    assert.equal(await specRepo.count(), oldCount)
  })

  it('should commit nested transactional use case', async function () {
    const nonTransSpecRepo = TestUtil.createRepo(TestSpecialistRepoTkn, undefined)
    const oldCount = await nonTransSpecRepo.count()

    const connection = AppContainer.get(PersistenceConnectionRegistry).get('test')
    if (!connection.beginTransaction || !connection.rollbackTransaction) {
      throw new AssertionError('Connection should support transactions')
    }

    const transactionalEm = await connection.beginTransaction()
    const useCase = TestUtil.createContextService(ParentTransactionalUseCaseTkn, transactionalEm)
    try {
      await useCase.run()
      assert.equal(await TestUtil.createRepo(TestSpecialistRepoTkn, transactionalEm).count(), oldCount + 2)
    } finally {
      await connection.rollbackTransaction(transactionalEm)
    }

    assert.equal(await nonTransSpecRepo.count(), oldCount)
  })

  it('transactional use case child should rollback', async function () {
    const nonTransSpecRepo = TestUtil.createRepo(TestSpecialistRepoTkn, undefined)
    const oldCount = await nonTransSpecRepo.count()

    const connection = AppContainer.get(PersistenceConnectionRegistry).get('test')
    if (!connection.beginTransaction || !connection.rollbackTransaction) {
      throw new AssertionError('Connection should support transactions')
    }

    const transactionalEm = await connection.beginTransaction()
    const useCase = TestUtil.createContextService(ParentTransactionalUseCaseTkn, transactionalEm)
    await useCase.run(false, true)

    assert.equal(await TestUtil.createRepo(TestSpecialistRepoTkn, transactionalEm).count(), oldCount + 1)

    await connection.rollbackTransaction(transactionalEm)

    assert.equal(await nonTransSpecRepo.count(), oldCount)
  })
})
