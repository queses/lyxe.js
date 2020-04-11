import { LuxeFramework } from '../lib/core/LuxeFramework'
import { AppConfigurator } from '../lib/core/config/AppConfigurator'
import * as fs from 'fs'
import { AppPathUtil } from '../lib/core/config/AppPathUtil'
import { PersistenceTypeormConfig } from '../lib/persistence-typeorm/PersistenceTypeormConfig'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  PersistenceTypeormConfig.useDefaultConnection(false)

  LuxeFramework.requirePlugins('logging', 'persistence-typeorm')
  LuxeFramework.requireModules('main')
}
