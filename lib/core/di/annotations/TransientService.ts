import { AppContainer } from '../AppContainer'
import { injectable } from 'inversify'
import { TClass, TServiceId } from '../luxie-di'

export const TransientService = <T> (id?: TServiceId<T>) => (target: TClass<T>) => {
  if (!id) {
    id = target
  }

  AppContainer.inst.setTransient(id, target)
  return injectable()(target)
}
