import { ConnectionOptions } from 'typeorm'
import { BaseTypeormConnection } from './BaseTypeormConnection'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { AppEnv } from '../core/config/AppEnv'
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

  protected get config (): ConnectionOptions {
    if (!AppConfigurator.has('db.default.type')) {
      throw new AppConfigurationError('Default TypeOrm Connection Error: "db.default.type" config param is not defined')
    }

    const config: ConnectionOptions = {
      name: this.persistenceConnectionName,
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
      entities: this.getDbEntities().concat(this.getExtraDbEntities())
    }

    const extraParams = PersistenceTypeormConfig.inst.defaultConnectionParams
    return (extraParams) ? Object.assign(config, extraParams) : config
  }

  private getDbEntities () {
    let modulesWildCard
    const modules = PersistenceTypeormConfig.inst.useDefaultOnlyInModules
    if (Array.isArray(modules)) {
      modulesWildCard = `+(${modules.join('|')})`
    } else {
      modulesWildCard = '*'
    }

    const fileExt = AppPathUtil.codeExtWildcard
    const srcDir = AppPathUtil.appSrc
    const patches = [ `${srcDir}/${modulesWildCard}/domain/model/*${fileExt}` ]

    if (AppEnv.inTest) {
      patches.push(`${srcDir}/${modulesWildCard}/tests/model/*${fileExt}`)
    }

    return patches
  }
}