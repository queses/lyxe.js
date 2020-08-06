import Token from '../core/di/Token'
import { IWebFacade } from './IWebFacade'
import { IWebContextInfoFactory } from './IWebContextInfoFactory'
import { IReqContextService } from './IReqContextService'

export const WebContextFactoryTkn = new Token<IWebContextInfoFactory>('IWebContextFactory')
export const WebFacadeTkn = new Token<IWebFacade>('IWebFacadeService')
export const ReqContextServiceTkn = new Token<IReqContextService>('IReqContextService')
