import { IDomainEvent } from './IDomainEvent'

export interface IDomainEventHandler <E extends IDomainEvent> {
  handle (event: E): void | Promise<void>
}
