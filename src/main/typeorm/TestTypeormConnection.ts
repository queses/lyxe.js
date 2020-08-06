import { ConnectionOptions } from 'typeorm'
import { AppPathUtil } from '../../../libsrc/core/config/AppPathUtil'
import { BaseTypeormConnection } from '../../../libsrc/persistence-typeorm/BaseTypeormConnection'
import { PersistenceConnection } from '../../../libsrc/persistence/annotations/PersistenceConnection'

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
