import { AppContainer } from '../core/di/AppContainer'
import { IDomainEventHandler } from './IDomainEventHandler'
import { IDomainEvent } from './IDomainEvent'
import { ServiceFactory } from '../core/context/ServiceFactory'

export abstract class BaseDomainEventHandler <E extends IDomainEvent> implements IDomainEventHandler<E> {
  public abstract handle (event: E): void | Promise<void>

  public configure (sf: ServiceFactory) {
    this._serviceFactory = sf
    return this
  }

  private _serviceFactory: ServiceFactory

  protected get serviceFactory () {
    if (!this._serviceFactory) {
      this._serviceFactory = AppContainer.get(ServiceFactory).configure({ asSystem: true })
    }

    return this._serviceFactory
  }

  protected get sf () {
    return this.serviceFactory
  }
}
