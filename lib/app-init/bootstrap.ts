import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('console', 'key-value-typeorm')
  require('./console/AppInitController')
}
