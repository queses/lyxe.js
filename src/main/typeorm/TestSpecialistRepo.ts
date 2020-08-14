import { TestSpecialist } from '../domain/model/TestSpecialist'
import { Repository } from 'lyxe/lib/persistence/annotations/Repository'
import { TestSpecialistRepoTkn } from '../test-tokens'
import { BaseRepository } from 'lyxe/lib/persistence-typeorm/BaseRepository'
import { ITestSpecialistRepo } from '../domain/test-repos'

@Repository(TestSpecialistRepoTkn, 'test')
export class TestSpecialistRepo extends BaseRepository<TestSpecialist, number> implements ITestSpecialistRepo {
  protected readonly entityClass = TestSpecialist

  public findByFirstName (needle: string) {
    return this.queryEntities(
      this.queryBuilder().where(`e.firstName = '${needle}'`, { needle })
    )
  }

  public findWhereFirstNameLike (needle: string) {
    return this.queryEntities(
      this.queryBuilder().where(`e.firstName LIKE :needle`, { needle: needle + '%' })
    )
  }

  public findWhereLastNameLike (needle: string) {
    return this.queryEntities(
      this.queryBuilder().where(`e.lastName LIKE :needle`, { needle })
    )
  }
}
