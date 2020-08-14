import Token from '../core/di/Token'
import { IAppLogger } from './IAppLogger'

export const AppLoggerTkn = new Token<IAppLogger>('IAppLogger')
