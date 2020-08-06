import { LuxieFramework } from '../core/LuxieFramework'

export default () => {
  LuxieFramework.requirePlugins('console', 'key-value-typeorm')
  require('./console/AppInitController')
}
