import { IEntityManager } from './IEntityManager'

export interface ITransactionEvenBus {
  listenToCommit (transactionStarter: IEntityManager, listener: () => void): void
  handleCommit (transactionStarter: IEntityManager): void
  handleRollback (transactionStarter: IEntityManager): void
}