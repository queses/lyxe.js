import { LuxieFramework } from '../core/LuxieFramework'
import { AppEnv } from '../core/config/AppEnv'

export default () => {
  AppEnv.setLaunchType('console')
  LuxieFramework.requirePlugins('logging')
}

