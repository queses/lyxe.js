import { NextFunction, Request, Response } from 'express'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'

export class ExpressRequestLogMiddleware {
  public static handler = (req: Request, res: Response, next: NextFunction) => {
    ExpressRequestLogMiddleware.inst.handle(req, res, next).catch(err => next(err))
  }

  private async handle (req: Request, res: Response, next: NextFunction) {
    let log = `${req.method} ${req.url}`
    if (req.body) {
      log += ` <- ${typeof req.body === 'object' ? JSON.stringify(req.body) : req.body}`
    }

    this.logger.log(log)
    next()
  }

  @Cached()
  private get logger () {
    return AppContainer.get(AppLoggerTkn)
  }

  private static get inst (): ExpressRequestLogMiddleware {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}