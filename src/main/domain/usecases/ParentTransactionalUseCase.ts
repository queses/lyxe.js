import { TransactionalUseCase } from 'lyxe/lib/persistence/annotations/TransactionalUseCase'
import { ChildTransactionalUseCaseTkn, ParentTransactionalUseCaseTkn, TestSpecialistRepoTkn } from '../../test-tokens'
import { BaseUseCase } from 'lyxe/lib/core/context/BaseUseCase'
import { IParentTransactionalUseCase } from '../test-use-cases'
import { InjectRepository } from 'lyxe/lib/persistence/annotations/InjectRepository'
import { ITestSpecialistRepo } from '../test-repos'
import { TestSpecialist } from '../model/TestSpecialist'

@TransactionalUseCase(ParentTransactionalUseCaseTkn, 'test')
export class ParentTransactionalUseCase extends BaseUseCase implements IParentTransactionalUseCase {
  @InjectRepository(TestSpecialistRepoTkn)
  private specialistRepo: ITestSpecialistRepo

  public async run (toThrow: boolean = false, toThrowChild = false) {
    await this.specialistRepo.save(TestSpecialist.create('Test', 'Testy'))

    try {
      await this.createUseCase(ChildTransactionalUseCaseTkn).run(toThrowChild)
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
