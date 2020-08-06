import { DomainError } from './DomainError'

export class DomainAccessError extends DomainError {
  name = 'DomainAccessError'
  
  constructor (message?: string) {
    super(message || `Trying to access restricted domain method`)
  }
}
