import { DomainError } from './DomainError'

export class DomainInvalidEventError extends DomainError {
  name = 'DomainInvalidEventError'

  constructor (message?: string) {
    super(message || 'Invalid event in domain event handler provided')
  }
}
