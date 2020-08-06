import Token from '../core/di/Token'
import { IMutex } from './domain/IMutex'

export const MutexTkn = new Token<IMutex>('IMutex')
