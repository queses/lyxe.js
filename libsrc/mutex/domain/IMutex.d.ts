import { MutexLockTime } from './MutexLockTime'
import { MutexLock } from './MutexLock'
import { TMutexExtend } from './mutex-types'

export interface IMutex {
  lock (name: string, lockTime: MutexLockTime | number): Promise<MutexLock>
  unlock (name: string): Promise<void>
  extend (name: string, lockTime: MutexLockTime | number): Promise<void>
  wrap <T> (name: string, lockTime: MutexLockTime | number, cb: (extend: TMutexExtend) => Promise<T> | T): Promise<T>
}
