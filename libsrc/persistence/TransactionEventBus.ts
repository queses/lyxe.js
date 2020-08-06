import { SingletonService } from '../core/di/annotations/SingletonService'
import { IEntityManager } from './IEntityManager'
import { ITransactionEvenBus } from './ITransactionEvenBus'
import { TransactionEventBusTkn } from './luxie-persistence-tokens'

@SingletonService(TransactionEventBusTkn)
export class TransactionEventBus implements ITransactionEvenBus {
  private listenersMap: WeakMap<IEntityManager, Array<() => void>> = new Map()

  listenToCommit (transactionStarter: IEntityManager, listener: () => void) {
    const listeners = this.listenersMap.get(transactionStarter)
    if (!listeners) {
      this.listenersMap.set(transactionStarter, [ listener ])
    } else {
      listeners.push(listener)
    }
  }

  handleCommit (transactionStarter: IEntityManager) {
    const listeners = this.listenersMap.get(transactionStarter)
    if (listeners) {
      for (const listener of listeners) {
        listener()
      }
    }

    this.listenersMap.delete(transactionStarter)
  }

  handleRollback (transactionStarter: IEntityManager) {
    this.listenersMap.delete(transactionStarter)
  }
}
