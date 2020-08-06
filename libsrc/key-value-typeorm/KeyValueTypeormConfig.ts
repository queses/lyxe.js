import { TPersistenceConnectionName } from '../persistence/luxie-persistence'

export class KeyValueTypeormConfig {
  public useWithConnection: TPersistenceConnectionName = 'default'

  public static useWithConnection (value: TPersistenceConnectionName) {
    this.inst.useWithConnection = value
    return this
  }

  public static get inst (): KeyValueTypeormConfig {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
