import { ConnectionOptions } from 'typeorm'
import { TPersistenceConnectionName } from '../persistence/lyxe-persistence'

export class PersistenceTypeormConfig {
  public useDefaultConnection: boolean = true
  public useDefaultOnlyInModules: string[] | undefined
  public connectionExtraEntities: Map<TPersistenceConnectionName, string[]> = new Map()
  public defaultConnectionParams: Partial<ConnectionOptions> | undefined

  public static useDefaultConnection (value: boolean) {
    this.inst.useDefaultConnection = value
    return this
  }

  public static useDefaultOnlyInModules (value: string[] | undefined) {
    this.inst.useDefaultOnlyInModules = value
    return this
  }

  public static defaultConnectionParams (value: Partial<ConnectionOptions> | undefined) {
    this.inst.defaultConnectionParams = value
    return this
  }

  public static addConnectionEntity (name: TPersistenceConnectionName, path: string) {
    const extraEntities = this.inst.connectionExtraEntities.get(name)
    if (extraEntities) {
      extraEntities.push(path)
    } else {
      this.inst.connectionExtraEntities.set(name, [ path ])
    }
  }

  public static get inst (): PersistenceTypeormConfig {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
