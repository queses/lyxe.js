import { TPersistenceConnectionName } from './luxe-persistence'
import { IPersistenceConnection } from './IPersistenceConnection'
import { TClass } from '../core/di/luxe-di'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { AppContainer } from '../core/di/AppContainer'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'

export class PersistenceConnectionRegistry {
  private addedConnections: Map<string, TClass<IPersistenceConnection>> = new Map()

  public static get inst (): PersistenceConnectionRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  public static get <T extends IPersistenceConnection = IPersistenceConnection> (name: TPersistenceConnectionName = 'default') {
    const connectionClass = this.inst.addedConnections.get(name)
    if (!connectionClass) {
      throw new InvalidArgumentError(`Cannot find persistence connection with name "${name}"`)
    }

    return AppContainer.get<T>(connectionClass)
  }

  public add (name: TPersistenceConnectionName, connection: TClass<IPersistenceConnection>) {
    if (this.addedConnections.has(name)) {
      throw new AppConfigurationError(`Cannot add "${name}" connection: persistence connection with same name exists`)
    }

    this.addedConnections.set(name, connection)
  }

  public replace (name: TPersistenceConnectionName, connection: TClass<IPersistenceConnection>) {
    this.addedConnections.set(name, connection)
  }

  public addedNames () {
    const names: string[] = []
    for (const key of this.addedConnections.keys()) {
      names.push(key)
    }

    return names
  }
}
