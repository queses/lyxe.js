import { Cached } from '../core/lang/annotations/Cached'
import { ReqContextServiceTkn } from '../web/lyxe-web-tokens'
import { TAuthContextInfo } from '../auth/auth-context'
import { TAnyRequest } from '../web/lyxe-web'
import { DomainAuthenticationNeededError } from '../core/domain-errors/DomainAuthenticationNeededError'
import { AppContainer } from '../core/di/AppContainer'
import { NextFunction, Request, Response } from 'express'

export class JwtContextExpressMiddleware {
  private restrictedPaths: string[] | undefined
  private allowedPaths: string[] | undefined

  public static restrictPaths (paths: string[]) {
    this.inst.restrictedPaths = paths
    return this
  }

  public static allowOnlyPaths (paths: string[]) {
    this.inst.allowedPaths = paths
    return this
  }

  public static handler = (req: Request, res: Response, next: NextFunction) => {
    return JwtContextExpressMiddleware.inst.handle(req).then(() => next()).catch(err => next(err))
  }

  private async handle (req: TAnyRequest) {
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
    if (this.allowedPaths) {
      for (const allowedPath of this.allowedPaths) {
        if (path.startsWith(allowedPath)) {
          return true
        }
      }

      return false
    } else if (this.restrictedPaths) {
      for (const allowedPath of this.restrictedPaths) {
        if (path.startsWith(allowedPath)) {
          return false
        }
      }

      return true
    }

    return true
  }

  private static get inst (): JwtContextExpressMiddleware {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
