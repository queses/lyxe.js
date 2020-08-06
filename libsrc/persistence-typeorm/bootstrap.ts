import { LyxeFramework } from '../core/LuxieFramework'

export default () => {
  LyxeFramework.requirePlugins('persistence')
  require('./DefaultTypeormConnection')
}
