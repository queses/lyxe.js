import { LuxieFramework } from '../core/LuxieFramework'

export default () => {
  LuxieFramework.requirePlugins('persistence')
  require('./DefaultTypeormConnection')
}
