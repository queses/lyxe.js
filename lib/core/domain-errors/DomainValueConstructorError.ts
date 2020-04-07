import { DomainInvalidArgumentError } from './DomainInvalidArgumentError'

export class DomainValueConstructorError extends DomainInvalidArgumentError {
  name = 'DomainInvalidArgumentError'
  
  constructor (message?: string) {
    super(message || 'Invalid argument provided to value object constructor')
  }
}
