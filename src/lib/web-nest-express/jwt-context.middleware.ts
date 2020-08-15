import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtContextExpressMiddleware } from '../web-express/JwtContextExpressMiddleware'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class JwtContextMiddleware implements NestMiddleware {
  public static restrictPaths (paths: string[]) {
    JwtContextExpressMiddleware.restrictPaths(paths)
    return this
  }

  public static allowOnlyPaths (paths: string[]) {
    JwtContextExpressMiddleware.allowOnlyPaths(paths)
    return this
  }

  public use (req: Request, res: Response, next: NextFunction) {
    return JwtContextExpressMiddleware.handler(req, res, next)
  }
}
