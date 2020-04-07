import { LuxeFramework } from '../core/LuxeFramework'
import { PersistenceTypeormConfig } from '../persistence-typeorm/PersistenceTypeormConfig'

export default () => {
  PersistenceTypeormConfig.addDefaultConnectionEntity(__dirname + './model')
  LuxeFramework.requirePlugin('key-value, persistence-typeorm')
  require('./typeorm/KeyValueTypeormStorage')
}
