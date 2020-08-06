import { DomainError } from './DomainError'

export class DomainEntityNotPersistedError extends DomainError {
  name = 'DomainEntityNotPersistedError'
  
  constructor (message?: string) {
    super(message || `Entity should be persisted to continue processing`)
  }
}
