import { AppPathUtil } from '../core/config/AppPathUtil'
import { PersistenceConnectionRegistry } from '../persistence/PersistenceConnectionRegistry'
import { ConnectionOptions } from 'typeorm'
import { BaseTypeormConnection } from './BaseTypeormConnection'
import { AppContainer } from '../core/di/AppContainer'

const bootstrapApp: () => void = require(AppPathUtil.appSrc + '/bootstrap').default
bootstrapApp()

const registry = AppContainer.get(PersistenceConnectionRegistry)
const connectionConfigs: ConnectionOptions[] = []
for (const persistenceConnectionName of registry.addedNames()) {
  const connection = registry.get(persistenceConnectionName)
  if (connection instanceof BaseTypeormConnection) {
    connectionConfigs.push(connection.config)
  }
}

export default connectionConfigs
