import { Container } from 'inversify'
import { TServiceId, TClass, TFactoryFunc } from './luxe-di'
import { IContainerInstance } from './IContainerInstance'
import { ServiceNotFoundError } from '../application-errors/ServiceNotFoundError'

export class ContainerInstance implements IContainerInstance {
  private container: Container

  constructor () {
    this.container = new Container()
  }

  get <T> (id: TServiceId<T>): T {
    try {
      return this.container.get(id)
    } catch (e) {
      throw new ServiceNotFoundError(id)
    }
  }

  getFactory <T> (id: TServiceId<T>): TFactoryFunc<T> {
    try {
      return this.container.get(id)
    } catch (e) {
      throw new ServiceNotFoundError(id)
    }
  }

  getMany <T> (id: TServiceId<T>): T[] {
    try {
      return this.container.getAll(id)
    } catch (e) {
      throw new ServiceNotFoundError(id)
    }
  }

  setTransient <T> (id: TServiceId<T>, target: TClass<T>) {
    this.container.bind(id).to(target).inTransientScope()
  }

  setSingleton <T> (id: TServiceId<T>, target: TClass<T>) {
    this.container.bind(id).to(target).inSingletonScope()
  }

  setFactory <T> (id: TServiceId<T>, target: TFactoryFunc<T>) {
    this.container.bind(id).toFactory((ctx) => target)
  }

  replaceTransient <T> (id: TServiceId<T>, target: TClass<T>) {
    this.container.rebind(id).to(target).inTransientScope()
  }

  replaceSingleton <T> (id: TServiceId<T>, target: TClass<T>) {
    this.container.rebind(id).to(target).inSingletonScope()
  }
}
