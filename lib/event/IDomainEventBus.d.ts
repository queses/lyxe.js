import { IDomainEvent } from './IDomainEvent'
import { TDomainEventType } from './luxe-event'
import { IContextService } from '../core/context/IContextService'
import { IDomainEventHandler } from './IDomainEventHandler'

export interface IDomainEventBus {
  listen <E extends IDomainEvent> (eventType: TDomainEventType, handler: IDomainEventHandler<E>): void
  remove <E extends IDomainEvent> (eventType: TDomainEventType): void
  emit <E extends IDomainEvent> (service: IContextService, eventType: TDomainEventType, event: E): void
}
