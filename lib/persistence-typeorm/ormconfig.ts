import { AppPathUtil } from '../core/config/AppPathUtil'
import { PersistenceConnectionRegistry } from '../persistence/PersistenceConnectionRegistry'
import { ConnectionOptions } from 'typeorm'
import { BaseTypeormConnection } from './BaseTypeormConnection'

const bootstrapApp: () => void = require(AppPathUtil.appSrc + '/bootstrap').default
bootstrapApp()

const connectionConfigs: ConnectionOptions[] = []
for (const luxeConnectionName of PersistenceConnectionRegistry.inst.addedNames()) {
  const connection = PersistenceConnectionRegistry.get(luxeConnectionName)
  if (connection instanceof BaseTypeormConnection) {
    connectionConfigs.push(connection.config)
  }
}

export default connectionConfigs