import { injectable } from 'inversify'
import { TClass, TServiceId } from '../lyxe-di'
import { AppContainer } from '../AppContainer'

export const ReplaceSingleton = <T> (id?: TServiceId<T>) => {
  return (target: TClass<T>) => {
    if (!id) {
      id = target
    }

    AppContainer.inst.replaceSingleton(id, target)
    return injectable()(target)
  }
}
