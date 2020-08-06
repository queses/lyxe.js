import { LuxieFramework } from '../core/LuxieFramework'

export default () => {
  LuxieFramework.requirePlugins('web', 'logging')
  require('./NestFileLogger')
  require('./ExpressWebFacade')
}
