import {AppError} from '../../application-errors/AppError'
import {ServiceShutdownHandlersRegistry} from '../../init/ServiceShutdownHandlersRegistry'
import {AppShutdownPhase} from "../AppShutdownPhase";

export const OnShutdown = <C> (phase: AppShutdownPhase = AppShutdownPhase.DEFAULT) => {
  return (target: C, name: string, descriptor: PropertyDescriptor) => {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new AppError(`Class member ${name} annotated with "@OnShutdown" should be a static function`)
    }
    
    ServiceShutdownHandlersRegistry.add(descriptor.value.bind(target), phase)
  }
}
