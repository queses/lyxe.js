import { MutexLockTime } from './MutexLockTime'
import { MutexLock } from './MutexLock'

export interface IMutex {
  lock (name: string, lockTime: MutexLockTime | number): Promise<MutexLock>
  unlock (name: string): Promise<void>
  extend (name: string, lockTime: MutexLockTime | number): Promise<void>

  wrap <T> (
    name: string,
    lockTime: MutexLockTime | number,
    cb: (extend: (lockTime: MutexLockTime | number) => Promise<void>) => Promise<T> | T
  ): Promise<T>
}
