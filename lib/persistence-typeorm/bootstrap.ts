import { LuxeFramework } from '../core/LuxeFramework'
import { PersistenceTypeormConfig } from './PersistenceTypeormConfig'

export default () => {
  LuxeFramework.requireModule('persistence')

  if (PersistenceTypeormConfig.inst.useDefaultConnection) {
    require('./DefaultTypeormConnection')
  }
}
