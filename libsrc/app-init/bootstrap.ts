import { LyxeFramework } from '../core/LuxieFramework'

export default () => {
  LyxeFramework.requirePlugins('console', 'key-value-typeorm')
  require('./console/AppInitController')
}
