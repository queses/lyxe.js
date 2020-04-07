import Token from '../core/di/Token'
import { IKeyValueContextStorage } from './IKeyValueContextStorage'

export const KeyValueContextStorageTkn = new Token<IKeyValueContextStorage>('IKeyValueContextStorage')