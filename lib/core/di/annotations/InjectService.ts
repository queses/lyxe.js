import { inject } from 'inversify'
import { TServiceId } from '../luxie-di'

export const InjectService = <T>(id: TServiceId<T>) => {
  return inject(id)
}
