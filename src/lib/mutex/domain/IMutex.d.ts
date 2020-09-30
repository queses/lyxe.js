import { MutexLockTime } from './MutexLockTime'
import { MutexLock } from './MutexLock'
import { TMutexExtend } from './mutex-types'

export interface IMutex {
  lock (name: string, lockTimeMs: MutexLockTime | number): Promise<MutexLock>
  unlock (name: string): Promise<void>
  extend (name: string, lockTimeMs: MutexLockTime | number): Promise<void>
  wrap <T> (name: string, lockTimeMs: MutexLockTime | number, cb: (extend: TMutexExtend) => Promise<T> | T): Promise<T>
}
