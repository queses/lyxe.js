import { ConnectionOptions } from 'typeorm'
import { PersistenceConnection } from '../../lib/persistence/annotations/PersistenceConnection'
import { AppPathUtil } from '../../lib/core/config/AppPathUtil'
import { BaseTypeormConnection } from '../../lib/persistence-typeorm/BaseTypeormConnection'

@PersistenceConnection('test')
export class TestTypeormConnection extends BaseTypeormConnection {
  public readonly persistenceConnectionName = 'test'

  public get config(): ConnectionOptions {
    return {
      type: 'sqlite',
      database: `${AppPathUtil.appData}/local/test.sqlite`,
      entities: this.getDbEntities([ 'main' ])
    }
  }
}
