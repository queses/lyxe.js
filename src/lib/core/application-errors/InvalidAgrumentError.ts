import { AppError } from './AppError'

export class InvalidArgumentError extends AppError {
  name = 'InvalidArgumentError'
  
  constructor (message?: string) {
    super(message || 'Invalid argument provided')
  }
}
