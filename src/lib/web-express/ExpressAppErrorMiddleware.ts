import { NextFunction, Request, Response } from 'express'
import { AppError } from '../core/application-errors/AppError'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { AppErrorConverter } from '../web/AppErrorConverter'
import { DomainErrorConverter } from '../web/DomainErrorConverter'
import { DomainError } from '../core/domain-errors/DomainError'

export class ExpressAppErrorMiddleware {
  public static handler = (err: Error | undefined, req: Request, res: Response, next: NextFunction) => {
    return ExpressAppErrorMiddleware.inst.handle(err, req, res, next)
  }

  private async handle (err: Error | undefined, req: Request, res: Response, next: NextFunction) {
    if (err) {
      if (err instanceof DomainError) {
        const httpError = this.domainErrorConverter.convert(err)
        if (!res.finished) {
          res.status(httpError.status).json(httpError.getErrorBody())
        }

        return
      } else if (err instanceof AppError) {
        const httpError = this.appErrorConverter.convert(err)
        if (!res.finished) {
          res.status(httpError.status).json(httpError.getErrorBody())
        }

        return
      }
    }

    next(err)
  }

  @Cached()
  private get appErrorConverter () {
    return AppContainer.get(AppErrorConverter)
  }

  @Cached()
  private get domainErrorConverter () {
    return AppContainer.get(DomainErrorConverter)
  }

  private static get inst (): ExpressAppErrorMiddleware {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
