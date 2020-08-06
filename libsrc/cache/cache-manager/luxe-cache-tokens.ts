import Token from '../../core/di/Token'
import { IAppFileCache } from '../IAppFileCache'
import { IAppCache } from '../IAppCache'

export const AppCacheTkn = new Token<IAppCache>('IAppFileCache')
export const AppFileCacheTkn = new Token<IAppFileCache>('IAppFileCache')