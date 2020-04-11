import { AppError } from '../../application-errors/AppError'
import { ServiceShutdownHandlersRegistry } from '../../init/ServiceShutdownHandlersRegistry'

export const OnShutdown = <C> () => {
  return (target: C, name: string, descriptor: PropertyDescriptor) => {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new AppError(`Class member ${name} annotated with "@OnShutdown" should be a function`)
    }
    
    ServiceShutdownHandlersRegistry.add(descriptor.value.bind(target))
  }
}
