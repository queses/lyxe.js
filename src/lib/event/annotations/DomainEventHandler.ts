import { TClass } from '../../core/di/lyxe-di'
import { IDomainEventHandler } from '../IDomainEventHandler'
import { TDomainEventType } from '../lyxe-event'
import { AppContainer } from '../../core/di/AppContainer'
import { DomainEventBusTkn } from '../lyxe-event-tokens'
import { IDomainEvent } from '../IDomainEvent'

export const DomainEventHandler = <E extends IDomainEvent, T extends IDomainEventHandler<E>> (type: TDomainEventType) => {
  return (target: TClass<T>) => {
    AppContainer.get(DomainEventBusTkn).listen(type, new target())
  }
}
