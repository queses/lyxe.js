import { ConnectionOptions } from 'typeorm'

export class PersistenceTypeormConfig {
  public useDefaultConnection: boolean = true
  public useDefaultOnlyInModules: string[] | undefined
  public defaultConnectionExtraEntities: string[] = []
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

  public static addDefaultConnectionEntity (path: string) {
    this.inst.defaultConnectionExtraEntities.push(path)
  }

  public static get inst (): PersistenceTypeormConfig {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}