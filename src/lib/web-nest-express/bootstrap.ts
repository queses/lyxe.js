import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('web', 'logging')
  require('./NestFileLogger')
  require('./ExpressWebFacade')
}
