import { TAnyRequest } from './lyxe-web'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { ReqContextServiceTkn, WebFacadeTkn } from './lyxe-web-tokens'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'
import { IReadService } from '../core/context/IReadService'
import { TServiceId } from '../core/di/lyxe-di'
import { IContextService } from '../core/context/IContextService'
import { WebRateLimiter } from './WebRateLimiter'
import * as MobileDetect from 'mobile-detect'

export class WebReqUtil {
  static readContextFromReq <C extends TBaseContextInfo> (req: TAnyRequest): C | undefined {
    return (this.reqContext) ? this.reqContext.readContextFromReq<C>(req) : undefined
  }

  static createService <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>, req: TAnyRequest): S {
    return AppContainer.get(id).configure(this.readContextFromReq<C>(req) || {} as C)
  }

  static createUseCase <S extends IContextService<C>, C extends TBaseContextInfo> (id: TServiceId<S>, req: TAnyRequest): S {
    return this.createService(id, req)
  }

  static createReadService <S extends IReadService<C>, C extends TBaseContextInfo> (id: TServiceId<S>, req: TAnyRequest): S {
    const ctx = this.readContextFromReq<C>(req) || {} as C
    ctx.inReadContext = true
    return AppContainer.get(id).configure(ctx)
  }

  static limitRate (req: TAnyRequest, limiterKey: string, maxRate: number, inSeconds: number = 1, message?: string) {
    const ip = this.webFacade.extractIp(req)
    return AppContainer.get(WebRateLimiter).limit(ip, limiterKey, maxRate, inSeconds, message)
  }

  static isSentByBot (req: TAnyRequest)  {
    const ua = this.webFacade.getHeader('user-agent', req)
    return (ua) ? ua.includes('Bot') || ua.includes('/bot') || new MobileDetect(ua).is('bot') : false
  }

  @Cached()
  private static get reqContext () {
    try {
      return AppContainer.get(ReqContextServiceTkn)
    } catch (e) {
      return
    }
  }

  @Cached()
  private static get webFacade () {
    return AppContainer.get(WebFacadeTkn)
  }
}
