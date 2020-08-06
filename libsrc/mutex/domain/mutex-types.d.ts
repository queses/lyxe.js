import { MutexLockTime } from './MutexLockTime'

export type TMutexExtend = (lockTime: MutexLockTime | number) => Promise<void>
