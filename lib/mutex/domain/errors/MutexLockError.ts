import { AppError } from '../../../core/application-errors/AppError'

export class MutexLockError extends AppError {
  name = 'MutexLockError'
}
