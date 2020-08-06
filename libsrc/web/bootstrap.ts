import { LyxeFramework } from '../core/LuxieFramework'
import { AppEnv } from '../core/config/AppEnv'

export default () => {
  AppEnv.setLaunchType('web')
  LyxeFramework.requirePlugins('logging', 'cache')
}
