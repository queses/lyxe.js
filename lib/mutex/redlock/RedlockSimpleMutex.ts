import { Cached } from '../../core/lang/annotations/Cached'
import * as Redlock from 'redlock'
import { OnShutdown } from '../../core/di/annotations/OnShutdown'
import { AppShutdownPhase } from '../../core/di/AppShutdownPhase'
import * as redis from 'redis'
import { AppConfigurator } from '../../core/config/AppConfigurator'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { MutexTkn } from '../luxe-mutex-tokens'
import { IMutex } from '../domain/IMutex'
import { AppContainer } from '../../core/di/AppContainer'
import { MutexLockTime } from '../domain/MutexLockTime'
import { MutexLock } from '../domain/MutexLock'
import { MutexLockError } from '../domain/errors/MutexLockError'
import { Conditional } from '../../core/lang/annotations/Conditional'
import { TMutexExtend } from '../domain/mutex-types'

@Conditional(() => AppConfigurator.get<boolean>('redis.enabled'), SingletonService(MutexTkn))
export class RedlockSimpleMutex implements IMutex {
  private locks: Map<string, Redlock.Lock> = new Map()
  private redlockCreated: boolean = false

  async lock (name: string, lockTime: MutexLockTime | number): Promise<MutexLock> {
    const lock = await this.redlock.lock('lx:mutex:' + name, lockTime)
    this.locks.set(name, lock)

    return new MutexLock(name, this)
  }

  async extend (name: string, lockTime: MutexLockTime | number): Promise<void> {
    const lock = this.locks.get(name)
    if (!lock) {
      throw new MutexLockError(`Cannot extend lock "${name}" because the lock has already expired`)
    }

    try {
      await lock.extend(lockTime)
    } catch (err) {
      if (err instanceof Redlock.LockError) {
        throw new MutexLockError(err.message)
      } else {
        throw err
      }
    }
  }

  async unlock (name: string): Promise<void> {
    const lock = this.locks.get(name)
    if (!lock) {
      throw new MutexLockError(`Cannot unlock lock "${name}" because the lock has already expired`)
    }

    try {
      await lock.unlock()
    } catch (err) {
      if (err instanceof Redlock.LockError) {
        throw new MutexLockError(err.message)
      } else {
        throw err
      }
    } finally {
      this.locks.delete(name)
    }
  }

  async wrap <T> (
    name: string,
    lockTime: MutexLockTime | number,
    cb: (extend: TMutexExtend) => Promise<T> | T
  ): Promise<T> {
    const lock = await this.lock(name, lockTime)
    const result = await cb(lock.extend.bind(lock))
    await lock.unlock()
    return result
  }

  @OnShutdown(AppShutdownPhase.LAST)
  public static async waitForFinish (): Promise<void> {
    const inst = AppContainer.get(MutexTkn)
    if (inst instanceof this && inst.redlockCreated) {
      await inst.redlock.quit()
    }
  }

  @Cached()
  public get redlock () {
    const client = redis.createClient(
      AppConfigurator.get<number>('redis.port'),
      AppConfigurator.get<string>('redis.host')
    )

    this.redlockCreated = true
    return new Redlock([ client ])
  }
}
