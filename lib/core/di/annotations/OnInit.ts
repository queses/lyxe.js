import { ServiceInitHandlersRegistry } from '../../init/ServiceInitHandlersRegistry'
import { AppError } from '../../application-errors/AppError'

export const OnInit = <C> () => {
  return (target: C, name: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new AppError(`Class member ${name} annotated with "@OnInit" should be a static function`)
    }

    ServiceInitHandlersRegistry.add(descriptor.value.bind(target))
  }
}
