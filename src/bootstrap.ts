import * as fs from 'fs'
import { AppConfigurator } from './lib/core/config/AppConfigurator'
import { AppPathUtil } from './lib/core/config/AppPathUtil'
import { KeyValueTypeormConfig } from './lib/key-value-typeorm/KeyValueTypeormConfig'
import { LyxeFramework } from './lib/core/LyxeFramework'
import { PersistenceTypeormConfig } from './lib/persistence-typeorm/PersistenceTypeormConfig'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  PersistenceTypeormConfig.useDefaultConnection(false)
  KeyValueTypeormConfig.useWithConnection('test')

  LyxeFramework.requirePlugins('logging', 'key-value-typeorm', 'event-local', 'validation-yup', 'mutex')
  LyxeFramework.requireModules('main')
}
