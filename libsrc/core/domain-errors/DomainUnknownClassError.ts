import { DomainError } from './DomainError'

export class DomainUnknownClassError extends DomainError {
  name = 'DomainUnknownClassError'
  
  constructor (message?: string) {
    super(message || `Object with unexpected class provided`)
  }
}
