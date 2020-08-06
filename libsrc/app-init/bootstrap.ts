import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('console', 'key-value-typeorm')
  require('./console/AppInitController')
}
