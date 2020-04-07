import { inject } from 'inversify'
import { TServiceId } from '../luxe-di'

export const InjectService = <T>(id: TServiceId<T>) => {
  return inject(id)
}
