import { LyxeFramework } from '../core/LuxieFramework'

export default () => {
  LyxeFramework.requirePlugins('web', 'logging')
  require('./NestFileLogger')
  require('./ExpressWebFacade')
}
