import { AppError } from './AppError'
import { TServiceId } from '../di/luxie-di'

export class ServiceNotFoundError extends AppError {
  name = 'ServiceNotFoundError'

  constructor  (id: TServiceId<any>, message?: string) {
    super(message)
    if (message) {
      return
    }

    this.message = (typeof id === 'function')
      ? `Service ${id.name} not found in container`
      : `Service ${id.toString()} not found in container`
  }
}
