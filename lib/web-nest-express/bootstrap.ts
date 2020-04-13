import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('web', 'logging')
  require('./NestFileLogger')
  require('./ExpressWebFacade')
}
