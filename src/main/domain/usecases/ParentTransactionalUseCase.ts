import { ChildTransactionalUseCaseTkn, ParentTransactionalUseCaseTkn, TestSpecialistRepoTkn } from '../../test-tokens'
import { IParentTransactionalUseCase } from '../test-use-cases'
import { ITestSpecialistRepo } from '../test-repos'
import { TestSpecialist } from '../model/TestSpecialist'
import { ChildTransactionalUseCase } from './ChildTransactionalUseCase'
import { TransactionalUseCase } from '../../../lib/persistence/annotations/TransactionalUseCase'
import { BaseUseCase } from '../../../lib/core/context/BaseUseCase'
import { InjectRepository } from '../../../lib/persistence/annotations/InjectRepository'
import { InjectContextService } from '../../../lib/core/context/annotations/InjectContextService'

@TransactionalUseCase(ParentTransactionalUseCaseTkn, 'test')
export class ParentTransactionalUseCase extends BaseUseCase implements IParentTransactionalUseCase {
  @InjectRepository(TestSpecialistRepoTkn)
  private specialistRepo: ITestSpecialistRepo

  @InjectContextService(ChildTransactionalUseCaseTkn)
  private childUseCase: ChildTransactionalUseCase

  public async run (toThrow: boolean = false, toThrowChild = false) {
    await this.specialistRepo.save(TestSpecialist.create('Test', 'Testy'))

    try {
      await this.childUseCase.run(toThrowChild)
    } catch (err) {
      if (!toThrowChild) {
        throw err
      }
    }
    
    if (toThrow) {
      throw Error()
    }
  }
}
