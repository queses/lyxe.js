import { SingletonService } from '../core/di/annotations/SingletonService'
import { EventEmitter } from 'events'
import { IAppLogger } from '../logging/IAppLogger'
import { AppLoggerTkn } from '../logging/luxe-logging-tokens'
import { InjectService } from '../core/di/annotations/InjectService'
import { IContextService } from '../core/context/IContextService'
import { IEntityManager } from '../persistence/IEntityManager'
import { EntityManagerMeta } from '../persistence/EntityManagerMeta'
import { OnShutdown } from '../core/di/annotations/OnShutdown'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { TransactionEventBusTkn } from '../persistence/luxe-persistence-tokens'
import { LuxeFramework } from '../core/LuxeFramework'
import { DomainEventBusTkn } from '../event/luxe-event-tokens'
import { IDomainEventBus } from '../event/IDomainEventBus'
import { IDomainEvent } from '../event/IDomainEvent'
import { TDomainEventType } from '../event/luxe-event'
import { IDomainEventHandler } from '../event/IDomainEventHandler'
import { PersistenceContextUtil } from '../persistence/PersistenceContextUtil'
import { OnInit } from '../core/di/annotations/OnInit'

@SingletonService(DomainEventBusTkn)
export class LocalDomainEventBus implements IDomainEventBus {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  private emitter: EventEmitter
  private pendingPromises: Array<Promise<void> | undefined>

  @OnInit()
  public async init (): Promise<void> {
    this.emitter = new EventEmitter()
    this.pendingPromises = []
  }

  @OnShutdown()
  public async waitForFinish (): Promise<void> {
    if (this.pendingPromises.length) {
      await Promise.all(this.pendingPromises)
    }
  }

  public listen <E extends IDomainEvent> (eventType: TDomainEventType, handler: IDomainEventHandler<E>): void {
    this.emitter.addListener(eventType, (...args: any) => {
      const result = Reflect.apply(handler.handle, handler, args)
      if (result instanceof Promise) {
        const index = this.pendingPromises.length
        this.pendingPromises.push(
          result
            .catch((err: Error) => this.logger.error(err.message))
            .then(() => this.onPromisedTaskFinish(index))
        )
      }
    })
  }

  public emit <E extends IDomainEvent> (service: IContextService, eventType: TDomainEventType, event: E): void {
    if (service.contextInfo && LuxeFramework.hasPlugin('persistence')) {
      const em: IEntityManager | undefined = PersistenceContextUtil.getTransactionalEm(service)
      if (em) {
        return this.emitWithManager(eventType, event, em)
      }
    }

    this.emitter.emit(eventType, event)
  }

  public remove <E extends IDomainEvent> (eventType: TDomainEventType): void {
    this.emitter.removeAllListeners(eventType)
  }

  private emitWithManager <E extends IDomainEvent> (eventType: TDomainEventType, event: E, em: IEntityManager): void {
    const transactionStarter: IEntityManager = Reflect.getMetadata(EntityManagerMeta.TRANSACTION_STARTER, em)
    if (transactionStarter) {
      this.transactionEventBus.listenToCommit(transactionStarter, () => this.emitter.emit(eventType, event))
    }
  }

  private onPromisedTaskFinish (promiseIndex: number) {
    if (promiseIndex === this.pendingPromises.length - 1) {
      this.pendingPromises = []
    } else {
      this.pendingPromises[promiseIndex] = undefined
    }
  }

  @Cached()
  private get transactionEventBus () { return AppContainer.get(TransactionEventBusTkn) }
}
