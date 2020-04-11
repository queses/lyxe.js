import { TClass, TFactoryFunc, TServiceId } from './luxe-di'
import { ContainerInstance } from './ContainerInstance'

export class AppContainer {
  public static get inst (): ContainerInstance {
    return Object.defineProperty(this, 'inst', { value: new ContainerInstance() }).inst
  }

  public static get <T> (id: TServiceId<T> | TClass<T>): T {
    return this.inst.get<T>(id)
  }
  
  public static getMany <T> (id: TServiceId<T>): T[] {
    return this.inst.getMany<T>(id)
  }

  public static getFactory <T> (id: TServiceId<T>): TFactoryFunc<T> {
    return this.inst.getFactory(id)
  }
}
