import { TestSpecialist } from '../domain/model/TestSpecialist'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { TestSpecialistSearchConf } from '../domain/model/TestSpecialistSearchConf'
import { ConfigurableTestSpecialistRepoTkn } from '../test-tokens'
import { ConfigurableRepository } from '../../lib/persistence-typeorm/ConfigurableRepository'
import { Repository } from '../../lib/persistence/annotations/Repository'

@Repository(ConfigurableTestSpecialistRepoTkn, 'test')
export class ConfigurableTestSpecialistRepo extends ConfigurableRepository<TestSpecialist, number> {
  protected get entityClass () { return TestSpecialist }

  public transformQuery (q: SelectQueryBuilder<TestSpecialist>, options?: TestSpecialistSearchConf): ObjectLiteral {
    if (!options) {
      options = new TestSpecialistSearchConf()
    }

    if (!options.searchDeleted) {
      q.andWhere(`e.isDeleted != true`)
    }

    return q
  }

  public findWhereFirstNameLike (needle: string, opts?: TestSpecialistSearchConf) {
    return this.queryEntities(
      this.queryBuilder().where(`e.firstName LIKE :needle`, { needle }),
      opts
    )
  }

  public countWhereLastNameStartsWith (needle: string, opts: TestSpecialistSearchConf) {
    return this.countEntities(
      this.queryBuilder().where(`e.lastName LIKE :needle`, { needle: needle + '%' }),
      opts
    )
  }
}
