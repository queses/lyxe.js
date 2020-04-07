import { ServiceFactory } from '../core/context/ServiceFactory'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { IDomainEventHandler } from './IDomainEventHandler'
import { IDomainEvent } from './IDomainEvent'

export abstract class AbstractDomainEventHandler <E extends IDomainEvent> implements IDomainEventHandler<E> {
  private serviceFactoryCache: ServiceFactory

  public abstract handle (event: E): void | Promise<void>

  protected get sf () {
    return this.serviceFactoryCache
  }

  @Cached()
  protected get serviceFactory () {
    return AppContainer.get(ServiceFactory).configure({ asSystem: true })
  }
}
