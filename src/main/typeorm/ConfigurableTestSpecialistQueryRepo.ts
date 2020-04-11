import { TestSpecialist } from '../domain/model/TestSpecialist'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { TestSpecialistSearchConf } from '../domain/model/TestSpecialistSearchConf'
import { Repository } from '../../../lib/persistence/annotations/Repository'
import { ConfigurableTestSpecialistRepoTkn } from '../test-tokens'
import { ConfigurableRepository } from '../../../lib/persistence-typeorm/ConfigurableRepository'

@Repository(ConfigurableTestSpecialistRepoTkn, 'test')
export class ConfigurableTestSpecialistQueryRepo extends ConfigurableRepository<TestSpecialist, number> {
  protected get entityClass () { return TestSpecialist }

  public transformQuery (q: SelectQueryBuilder<TestSpecialist>, options: TestSpecialistSearchConf): ObjectLiteral {
    if (options.onlyInactive) {
      q.andWhere(`e.isActive != true`)
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