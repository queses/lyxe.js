import { injectable } from 'inversify'
import { TClass, TServiceId } from '../luxe-di'
import { AppContainer } from '../AppContainer'

export const SingletonService = <T> (id?: TServiceId<T>) => {
  return (target: TClass<T>) => {
    if (!id) {
      id = target
    }

    AppContainer.inst.setSingleton(id, target)
    return injectable()(target)
  }
}