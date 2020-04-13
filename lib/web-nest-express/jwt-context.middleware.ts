import { Injectable, NestMiddleware } from '@nestjs/common'
import { Cached } from '../core/lang/annotations/Cached'
import { ReqContextServiceTkn } from '../web/luxe-web-tokens'
import { TAuthContextInfo } from '../auth/auth-context'
import { TAnyRequest, TAnyResponse } from '../web/luxe-web'
import { DomainAuthenticationNeededError } from '../core/domain-errors/DomainAuthenticationNeededError'
import { AppContainer } from '../core/di/AppContainer'

@Injectable()
export class JwtContextMiddleware implements NestMiddleware {
  private static restrictedPaths: string[] | undefined
  private static allowedPaths: string[] | undefined

  public static restrictPaths (paths: string[]) {
    this.restrictedPaths = paths
    return this
  }

  public static allowOnlyPaths (paths: string[]) {
    this.allowedPaths = paths
    return this
  }

  public use (req: TAnyRequest, res: TAnyResponse, next: Function) {
    this.handleRequest(req).catch(err => { throw err }).then(() => next())
  }

  private async handleRequest (req: TAnyRequest) {
    if (!this.reqContextSrv) {
      return
    }

    await this.reqContextSrv.writeContextToReq(req)
    const writtenContext: TAuthContextInfo = this.reqContextSrv.readContextFromReq(req)
    if ((!writtenContext || !writtenContext.auth) && !this.isPathAllowedWithoutAuth(req.baseUrl)) {
      throw new DomainAuthenticationNeededError()
    }
  }

  @Cached()
  private get reqContextSrv () {
    try {
      return AppContainer.get(ReqContextServiceTkn)
    } catch (e) {
      return undefined
    }
  }

  private isPathAllowedWithoutAuth (path: string) {
    if (JwtContextMiddleware.allowedPaths) {
      for (const allowedPath of JwtContextMiddleware.allowedPaths) {
        if (path.startsWith(allowedPath)) {
          return true
        }
      }

      return false
    } else if (JwtContextMiddleware.restrictedPaths) {
      for (const allowedPath of JwtContextMiddleware.restrictedPaths) {
        if (path.startsWith(allowedPath)) {
          return false
        }
      }

      return true
    }

    return true
  }
}
