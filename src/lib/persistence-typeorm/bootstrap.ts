import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('persistence')
  require('./DefaultTypeormConnection')
}
