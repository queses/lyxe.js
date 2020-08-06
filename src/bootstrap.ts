import { LuxieFramework } from '../lib/core/LuxieFramework'
import { AppConfigurator } from '../lib/core/config/AppConfigurator'
import * as fs from 'fs'
import { AppPathUtil } from '../lib/core/config/AppPathUtil'
import { PersistenceTypeormConfig } from '../lib/persistence-typeorm/PersistenceTypeormConfig'
import { KeyValueTypeormConfig } from '../lib/key-value-typeorm/KeyValueTypeormConfig'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  PersistenceTypeormConfig.useDefaultConnection(false)
  KeyValueTypeormConfig.useWithConnection('test')

  LuxieFramework.requirePlugins('logging', 'key-value-typeorm', 'event-local', 'validation-yup', 'mutex')
  LuxieFramework.requireModules('main')
}
