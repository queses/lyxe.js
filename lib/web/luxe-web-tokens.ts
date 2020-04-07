import Token from '../core/di/Token'
import { IWebContextFactory } from './IWebContextInfoFactory'
import { IWebFacade } from './IWebFacade'

export const WebContextFactoryTkn = new Token<IWebContextFactory>('IWebContextFactory')
export const WebFacadeTkn = new Token<IWebFacade>('IWebFacadeService')
