import { AppError } from './AppError'

export class ResourceTemporaryUnavailableError extends AppError {
  name = 'ResourceTemporaryUnavailableError'

  constructor (message?: string) {
    super(message || 'Resource you requested is temporary unavailable')
  }
}
