import { LyxeFramework } from '../core/LyxeFramework'
import { AppEnv } from '../core/config/AppEnv'

export default () => {
  AppEnv.setLaunchType('console')
  LyxeFramework.requirePlugins('logging')
}

