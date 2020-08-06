import { ConnectionOptions } from 'typeorm'
import { BaseTypeormConnection } from './BaseTypeormConnection'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { PersistenceTypeormConfig } from './PersistenceTypeormConfig'
import { PersistenceConnection } from '../persistence/annotations/PersistenceConnection'
import { Conditional } from '../core/lang/annotations/Conditional'

@Conditional(
  () => PersistenceTypeormConfig.inst.useDefaultConnection,
  PersistenceConnection('default')
)
export class DefaultTypeormConnection extends BaseTypeormConnection {
  protected readonly persistenceConnectionName = 'default'

  public get config (): ConnectionOptions {
    if (!AppConfigurator.has('db.default.type')) {
      throw new AppConfigurationError('Default TypeOrm Connection Error: "db.default.type" config param is not defined')
    }

    const config: ConnectionOptions = {
      type: AppConfigurator.get<any>('db.default.type'),
      host: AppConfigurator.get<string>('db.default.host'),
      port: AppConfigurator.get<number>('db.default.port'),
      username: AppConfigurator.get<string>('db.default.username'),
      password: AppConfigurator.get<string>('db.default.password'),
      database: AppConfigurator.get<string>('db.default.database'),
      cache: AppConfigurator.get<boolean>('db.default.cache') && AppConfigurator.get<boolean>('redis.enabled') && {
        type: 'redis',
        duration: 3000,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: AppConfigurator.get<number>('redis.port')
        }
      },
      entities: this.getDbEntities(PersistenceTypeormConfig.inst.useDefaultOnlyInModules)
    }

    const extraParams = PersistenceTypeormConfig.inst.defaultConnectionParams
    return (extraParams) ? Object.assign(config, extraParams) : config
  }
}