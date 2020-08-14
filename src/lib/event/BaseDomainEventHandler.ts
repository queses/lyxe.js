import { ServiceFactory } from '../core/context/ServiceFactory'
import { AppContainer } from '../core/di/AppContainer'
import { IDomainEventHandler } from './IDomainEventHandler'
import { IDomainEvent } from './IDomainEvent'
import { IServiceFactory } from '../core/context/IServiceFactory'

export abstract class BaseDomainEventHandler <E extends IDomainEvent> implements IDomainEventHandler<E> {
  public abstract handle (event: E): void | Promise<void>

  public configure (sf: IServiceFactory) {
    this._serviceFactory = sf
    return this
  }

  private _serviceFactory: IServiceFactory

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
