import { TServiceId, TClass, TFactoryFunc } from './luxie-di'

export interface IContainerInstance {
  get <T> (id: TServiceId<T>): T
  getMany <T> (id: TServiceId<T>): T[]
  getFactory <T> (id: TServiceId<T>): TFactoryFunc<T>
  setTransient <T> (id: TServiceId<T>, target: TClass<T>): void
  setSingleton <T> (id: TServiceId<T>, target: TClass<T>): void
  replaceTransient <T> (id: TServiceId<T>, target: TClass<T>): void
  replaceSingleton <T> (id: TServiceId<T>, target: TClass<T>): void
  setFactory <T> (id: TServiceId<T>, target: TFactoryFunc<T>): void
}
