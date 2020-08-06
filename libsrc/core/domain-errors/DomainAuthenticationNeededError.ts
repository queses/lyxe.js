import { DomainError } from './DomainError'

export class DomainAuthenticationNeededError extends DomainError {
  name = 'DomainAuthenticationNeededError'
  
  constructor (message?: string) {
    super(message || `Authentication needed to access given domain method`)
  }
}
