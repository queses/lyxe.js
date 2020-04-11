import { LuxeFramework } from '../lib/core/LuxeFramework'
import { AppConfigurator } from '../lib/core/config/AppConfigurator'
import * as fs from 'fs'
import { AppPathUtil } from '../lib/core/config/AppPathUtil'

export default () => {
  const config = fs.readFileSync(AppPathUtil.appData + '/.appconfig').toString()
  AppConfigurator.importConfig(config)

  LuxeFramework.requirePlugins('logging')
  LuxeFramework.requireModules('main')
}
