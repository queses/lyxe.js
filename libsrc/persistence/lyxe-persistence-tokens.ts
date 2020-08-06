import Token from '../core/di/Token'
import { IRepositoryFactory } from './IRepositoryFactory'
import { ITransactionEvenBus } from './ITransactionEvenBus'

export const RepositoryFactoryTkn = new Token<IRepositoryFactory>('IRepositoryFactory')
export const TransactionEventBusTkn = new Token<ITransactionEvenBus>('ITransactionEvenBus')
