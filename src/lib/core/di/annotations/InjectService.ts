import { inject } from 'inversify'
import { TServiceId } from '../lyxe-di'

export const InjectService = <T>(id: TServiceId<T>) => {
  return inject(id)
}
