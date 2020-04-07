import { DomainError } from './DomainError'

export class DomainInvalidArgumentError extends DomainError {
  name = 'DomainInvalidArgumentError'

  constructor (message?: string) {
    super(message || 'Invalid argument in domain logic provided')
  }
}
