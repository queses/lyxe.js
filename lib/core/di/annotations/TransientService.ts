import { AppContainer } from '../AppContainer'
import { injectable } from 'inversify'
import { TClass, TServiceId } from '../luxe-di'

export const TransientService = <T> (id?: TServiceId<T>) => {
  return (target: TClass<T>) => {
    if (!id) {
      id = target as any
    }

    AppContainer.inst.setTransient(id as TServiceId<T> | TClass<T>, target)

    return injectable()(target)
  }
}
