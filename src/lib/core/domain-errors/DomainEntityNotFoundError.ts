import { DomainError } from './DomainError'
import { TClass } from '../di/lyxe-di'

export class DomainEntityNotFoundError extends DomainError {
  name = 'DomainEntityNotFoundError'
  
  constructor (entityClassOrMessage: TClass<any> | string) {
    super(
      (typeof entityClassOrMessage === 'function')
        ? `Entity of type ${entityClassOrMessage.name} not found in persistence storage`
        : entityClassOrMessage
    )
  }
}
