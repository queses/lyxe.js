import { LyxeFramework } from '../core/LuxieFramework'
import { AppEnv } from '../core/config/AppEnv'

export default () => {
  AppEnv.setLaunchType('console')
  LyxeFramework.requirePlugins('logging')
}

