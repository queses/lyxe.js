import Token from './di/Token'
import { IDefaultContextFactory } from './context/IDefaultContextFactory'

export const DefaultContextFactoryTkn = new Token<IDefaultContextFactory>('IDefaultContextFactory')
