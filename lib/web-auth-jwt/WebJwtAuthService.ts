import { InjectService } from '../core/di/annotations/InjectService'
import { JwtServiceTkn } from './luxe-web-auth-jwt-tokens'
import { IJwtService } from './IJwtService'
import { WebContextFactoryTkn, WebFacadeTkn } from '../web/luxe-web-tokens'
import { IWebFacade } from '../web/IWebFacade'
import { TAnyRequest, TAnyResponse } from '../web/luxe-web'
import { TAuthJwtPayload } from './luxe-web-auth-jwt'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { AppConfigurationError } from '../core/application-errors/AppConfigurationError'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { SingletonService } from '../core/di/annotations/SingletonService'

const REQ_KEY_CONTEXT = 'luxe-context-info'
const REQ_KEY_JWT = 'luxe-jwt-content'

@SingletonService()
export class WebAuthJwtService {
  @InjectService(JwtServiceTkn)
  private jwtSrv: IJwtService

  @InjectService(WebFacadeTkn)
  private webFacade: IWebFacade

  public extractContextInfoFromReq (req: TAnyRequest) {
    return req[REQ_KEY_CONTEXT]
  }

  public extractAuthTokenFromReq (req: TAnyRequest): TAuthJwtPayload | undefined {
    return req[REQ_KEY_JWT]
  }

  public async saveAuthDataToReq (req: TAnyRequest, jwt: TAuthJwtPayload) {
    if (!jwt) {
      return
    }

    req[REQ_KEY_JWT] = jwt
    req[REQ_KEY_CONTEXT] = this.contextInfoFactory.getContext(req, {
      authId: parseInt(jwt.uid, 10),
      authorities: await this.jwtSrv.decryptAuthorities(jwt.atl)
    })
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
    return this.jwtSrv.verifyAndDecode(token).catch(() => {}) as Promise<TAuthJwtPayload | undefined>
  }

  public setRefreshTokenCookie (res: TAnyResponse, refreshToken: string, durationSec: number): void {
    this.webFacade.setCookie(AppConfigurator.get<string>('auth.refreshTokenCookie'), refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + durationSec * 1000),
      domain: this.cookieDomain
    }, res)
  }

  removeRefreshTokenCookie (res: TAnyRequest) {
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
  private get contextInfoFactory () {
    try {
      return AppContainer.get(WebContextFactoryTkn)
    } catch (e) {
      throw new AppConfigurationError('WebAuthJwtService Error: interface `IWebContextFactory` should be implemented')
    }
  }

  @Cached()
  private get cookieDomain () {
    return AppConfigurator.get<string>('web.mainHost').replace(/^https?:\/\//, '')
  }
}