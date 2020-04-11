import Token from '../core/di/Token'
import { IAppInitAction } from './IAppInitAction'

export const AppInitActionTkn = new Token<IAppInitAction>('IAppInitAction')
