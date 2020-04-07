import Token from '../core/di/Token'
import { IRepositoryFactory } from './IRepositoryFactory'
import { IPersistenceConnection } from './IPersistenceConnection'
import { ITransactionEvenBus } from './ITransactionEvenBus'

export const RepositoryFactoryTkn = new Token<IRepositoryFactory>('IRepositoryFactory')
export const DefaultPersistenceTkn = new Token<IPersistenceConnection>('IPersistenceConnection')
export const TransactionEventBusTkn = new Token<ITransactionEvenBus>('ITransactionEvenBus')
