import { TestSpecialistAccountRepoTkn } from '../test-tokens'
import { TestSpecialistAccount } from '../domain/model/TestSpecialistAccount'
import { ITestSpecialistAccountRepo } from '../domain/test-repos'
import { Repository } from '../../lib/persistence/annotations/Repository'
import { BaseRepository } from '../../lib/persistence-typeorm/BaseRepository'

@Repository(TestSpecialistAccountRepoTkn, 'test')
export class TestSpecialistAccountRepository
  extends BaseRepository<TestSpecialistAccount, number>
  implements ITestSpecialistAccountRepo
{
  protected readonly entityClass = TestSpecialistAccount
}
