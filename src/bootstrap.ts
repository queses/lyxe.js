import { LyxeFramework } from '../libsrc/core/LyxeFramework'
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

  LyxeFramework.requirePlugins('logging', 'key-value-typeorm', 'event-local', 'validation-yup', 'mutex')
  LyxeFramework.requireModules('main')
}
