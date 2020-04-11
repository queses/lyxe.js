import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('persistence', 'console')
  require('./DefaultTypeormConnection')
}
