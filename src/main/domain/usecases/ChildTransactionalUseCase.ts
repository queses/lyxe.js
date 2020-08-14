import { ChildTransactionalUseCaseTkn, TestSpecialistRepoTkn } from '../../test-tokens'
import { IChildTransactionalUseCase } from '../test-use-cases'
import { ITestSpecialistRepo } from '../test-repos'
import { TestSpecialist } from '../model/TestSpecialist'
import { TransactionalUseCase } from '../../../lib/persistence/annotations/TransactionalUseCase'
import { InjectRepository } from '../../../lib/persistence/annotations/InjectRepository'
import { BaseUseCase } from '../../../lib/core/context/BaseUseCase'

@TransactionalUseCase(ChildTransactionalUseCaseTkn, 'test')
export class ChildTransactionalUseCase extends BaseUseCase implements IChildTransactionalUseCase {
  @InjectRepository(TestSpecialistRepoTkn)
  private specialistRepo: ITestSpecialistRepo

  public async run (toThrow: boolean = false) {
    await this.specialistRepo.save(TestSpecialist.create('Test', 'Another'))

    if (toThrow) {
      throw Error()
    }
  }
}
