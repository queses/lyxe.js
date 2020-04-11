import { LuxeFramework } from '../core/LuxeFramework'
import { PersistenceTypeormConfig } from './PersistenceTypeormConfig'

export default () => {
  LuxeFramework.requirePlugins('persistence', 'console')

  if (PersistenceTypeormConfig.inst.useDefaultConnection) {
    require('./DefaultTypeormConnection')
  }
}
