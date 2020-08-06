import Token from '../core/di/Token'
import { IDomainEventBus } from './IDomainEventBus'

export const DomainEventBusTkn = new Token<IDomainEventBus>('IDomainEventBus')
