import { AppConfigurationError } from './AppConfigurationError'

export class ResourceNotFoundError extends AppConfigurationError {
  name = 'ResourceNotFoundError'

  constructor (message?: string) {
    super(message || 'Requested resource not found')
  }
}
