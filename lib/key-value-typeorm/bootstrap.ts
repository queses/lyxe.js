import { LuxeFramework } from '../core/LuxeFramework'
import { PersistenceTypeormConfig } from '../persistence-typeorm/PersistenceTypeormConfig'
import { KeyValueTypeormConfig } from './KeyValueTypeormConfig'

export default () => {
  const connectionName = KeyValueTypeormConfig.inst.useWithConnection
  PersistenceTypeormConfig.addConnectionEntity(connectionName, __dirname + '/model')
  LuxeFramework.requirePlugins('key-value', 'persistence-typeorm')

  require('./typeorm/KeyValueTypeormStorage')
}
