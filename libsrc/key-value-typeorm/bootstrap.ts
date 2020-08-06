import { LyxeFramework } from '../core/LyxeFramework'
import { PersistenceTypeormConfig } from '../persistence-typeorm/PersistenceTypeormConfig'
import { KeyValueTypeormConfig } from './KeyValueTypeormConfig'

export default () => {
  const connectionName = KeyValueTypeormConfig.inst.useWithConnection
  PersistenceTypeormConfig.addConnectionEntity(connectionName, __dirname + '/model')
  LyxeFramework.requirePlugins('key-value', 'persistence-typeorm')

  require('./typeorm/KeyValueTypeormStorage')
}
