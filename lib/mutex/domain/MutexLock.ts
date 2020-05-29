import { IMutex } from './IMutex'
import { MutexLockTime } from './MutexLockTime'

export class MutexLock {
  constructor (
    private name: string,
    private mutex: IMutex,
  ) {}

  unlock (): Promise<void> {
    return this.mutex.unlock(this.name)
  }

  extend (lockTime: MutexLockTime | number): Promise<void> {
    return this.mutex.extend(this.name, lockTime)
  }
}
