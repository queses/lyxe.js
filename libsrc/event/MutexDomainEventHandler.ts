import { AppContainer } from '../core/di/AppContainer'
import { IDomainEventHandler } from './IDomainEventHandler'
import { IDomainEvent } from './IDomainEvent'
import { BaseDomainEventHandler } from './BaseDomainEventHandler'
import { MutexTkn } from '../mutex/lyxe-mutex-tokens'
import { MutexLockTime } from '../mutex/domain/MutexLockTime'
import { TMutexExtend } from '../mutex/domain/mutex-types'

export abstract class MutexDomainEventHandler <E extends IDomainEvent>
  extends BaseDomainEventHandler<E>
  implements IDomainEventHandler<E>
{
  protected abstract handleInner (event: E, extend: TMutexExtend): void | Promise<void>
  protected abstract getMutexName (event: E): string

  public handle (event: E): void | Promise<void> {
    return AppContainer.get(MutexTkn).wrap(
      this.getMutexName(event),
      this.getMutexLockTime(event),
      (extend: TMutexExtend) => this.handleInner(event, extend)
    )
  }

  protected getMutexLockTime (event: E) {
    return MutexLockTime.DEFAULT
  }
}
