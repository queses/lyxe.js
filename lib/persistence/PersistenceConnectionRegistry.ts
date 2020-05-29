import { TPersistenceConnectionName } from './luxe-persistence'
import { IPersistenceConnection } from './IPersistenceConnection'
import { TClass } from '../core/di/luxe-di'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { AppContainer } from '../core/di/AppContainer'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { OnInit } from '../core/di/annotations/OnInit'
import { OnShutdown } from '../core/di/annotations/OnShutdown'
import { AppShutdownPhase } from '../core/di/AppShutdownPhase'
import { AppInitPhase } from '../core/di/AppInitPhase'

@SingletonService()
export class PersistenceConnectionRegistry {
  private addedConnections: Map<string, symbol> = new Map()

  @OnInit(AppInitPhase.INITIAL)
  public static async openConnections () {
    const inst = AppContainer.get(PersistenceConnectionRegistry)
    const promises: Promise<void>[] = []
    for (const name of inst.addedConnections.keys()) {
      promises.push(inst.get(name).connect())
    }

    await Promise.all(promises)
  }

  @OnShutdown(AppShutdownPhase.LAST)
  public static async closeConnections () {
    const inst = AppContainer.get(PersistenceConnectionRegistry)
    const promises: Promise<void>[] = []
    for (const name of inst.addedConnections.keys()) {
      promises.push(inst.get(name).close())
    }

    await Promise.all(promises)
  }

  public get <T extends IPersistenceConnection = IPersistenceConnection> (name: TPersistenceConnectionName = 'default') {
    const connectionClass = this.addedConnections.get(name)
    if (!connectionClass) {
      throw new InvalidArgumentError(`Cannot find persistence connection with name "${name}"`)
    }

    return AppContainer.get<T>(connectionClass)
  }

  public add (name: TPersistenceConnectionName, connection: TClass<IPersistenceConnection>) {
    if (this.addedConnections.has(name)) {
      throw new AppConfigurationError(`Cannot add "${name}" connection: persistence connection with same name exists`)
    }

    const id = Symbol(name)
    this.addedConnections.set(name, id)
    AppContainer.inst.setSingleton(id, connection)
  }

  public replace (name: TPersistenceConnectionName, connection: TClass<IPersistenceConnection>) {
    const id = this.addedConnections.get(name) || Symbol('name')
    AppContainer.inst.replaceSingleton(id, connection)
  }

  public addedNames () {
    const names: string[] = []
    for (const name of this.addedConnections.keys()) {
      names.push(name)
    }

    return names
  }
}
