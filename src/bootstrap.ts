import { LuxieFramework } from '../libsrc/core/LuxieFramework'
import { AppConfigurator } from '../libsrc/core/config/AppConfigurator'
import * as fs from 'fs'
import { AppPathUtil } from '../libsrc/core/config/AppPathUtil'
import { PersistenceTypeormConfig } from '../libsrc/persistence-typeorm/PersistenceTypeormConfig'
import { KeyValueTypeormConfig } from '../libsrc/key-value-typeorm/KeyValueTypeormConfig'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  PersistenceTypeormConfig.useDefaultConnection(false)
  KeyValueTypeormConfig.useWithConnection('test')

  LuxieFramework.requirePlugins('logging', 'key-value-typeorm', 'event-local', 'validation-yup', 'mutex')
  LuxieFramework.requireModules('main')
}
