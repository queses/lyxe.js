import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('web', 'logging')
  require('./ExpressLogger')
  require('./ExpressWebFacade')
}
