require('module-alias').addAlias('lyxe/lib', __dirname + '/lib')

import { LyxeFramework } from 'lyxe/lib/core/LyxeFramework'
import { AppConfigurator } from 'lyxe/lib/core/config/AppConfigurator'
import * as fs from 'fs'
import { AppPathUtil } from 'lyxe/lib/core/config/AppPathUtil'
import { PersistenceTypeormConfig } from 'lyxe/lib/persistence-typeorm/PersistenceTypeormConfig'
import { KeyValueTypeormConfig } from 'lyxe/lib/key-value-typeorm/KeyValueTypeormConfig'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  PersistenceTypeormConfig.useDefaultConnection(false)
  KeyValueTypeormConfig.useWithConnection('test')

  LyxeFramework.requirePlugins('logging', 'key-value-typeorm', 'event-local', 'validation-yup', 'mutex')
  LyxeFramework.requireModules('main')
}
