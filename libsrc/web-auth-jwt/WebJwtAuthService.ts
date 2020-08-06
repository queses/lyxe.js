import { InjectService } from '../core/di/annotations/InjectService'
import { JwtServiceTkn } from './lyxe-web-auth-jwt-tokens'
import { IJwtService } from './IJwtService'
import { WebFacadeTkn } from '../web/lyxe-web-tokens'
import { TAnyRequest, TAnyResponse } from '../web/lyxe-web'
import { TAuthJwtPayload } from './lyxe-web-auth-jwt'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'

const REQ_KEY_CONTEXT = 'lyxe-context-info'
const REQ_KEY_JWT = 'lyxe-jwt-content'

@SingletonService()
export class WebAuthJwtService {
  @InjectService(JwtServiceTkn)
  private jwtSrv: IJwtService

  public readContextInfoFromReq (req: TAnyRequest) {
    return req[REQ_KEY_CONTEXT]
  }

  public readAuthTokenFromReq (req: TAnyRequest): TAuthJwtPayload | undefined {
    return req[REQ_KEY_JWT]
  }

  public async writeContextInfoToReq (context: TBaseContextInfo, req: TAnyRequest) {
    req[REQ_KEY_CONTEXT] = context
  }

  public async getAuthTokenFromReq (req: TAnyRequest): Promise<TAuthJwtPayload | undefined> {
    if (req[REQ_KEY_JWT]) {
      return req[REQ_KEY_JWT]
    }

    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return
    }

    const token = authHeader.substr(7)
    const decoded = this.jwtSrv.verifyAndDecode(token).catch(() => {}) as Promise<TAuthJwtPayload | undefined>
    req[REQ_KEY_JWT] = decoded

    return decoded
  }

  public setRefreshTokenCookie (res: TAnyResponse, refreshToken: string, durationSec: number): void {
    this.webFacade.setCookie(AppConfigurator.get<string>('auth.refreshTokenCookie'), refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + durationSec * 1000),
      domain: this.cookieDomain
    }, res)
  }

  public removeRefreshTokenCookie (res: TAnyRequest) {
    return this.webFacade.removeCookie(
      AppConfigurator.get<string>('auth.refreshTokenCookie'),
      { httpOnly: true, domain: this.cookieDomain },
      res
    )
  }

  public getRefreshTokenFromReqCookie (req: TAnyRequest): string | undefined {
    return this.webFacade.getCookie(AppConfigurator.get<string>('auth.refreshTokenCookie'), req)
  }

  @Cached()
  private get cookieDomain () {
    return AppConfigurator.get<string>('web.mainHost').replace(/^https?:\/\//, '')
  }

  @Cached()
  private get webFacade () {
    return AppContainer.get(WebFacadeTkn)
  }
}
