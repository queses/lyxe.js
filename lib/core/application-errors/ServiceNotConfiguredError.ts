import { AppError } from './AppError'
import { TClass } from '../di/luxe-di'

export class ServiceNotConfiguredError extends AppError {
  name = 'ServiceNotConfiguredError'

  constructor (serviceClass: TClass<any>, message?: string) {
    super(message || `Injected service ${serviceClass.name} not configured or configured incorrectly`)
  }
}
