import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { Cached } from '../core/lang/annotations/Cached'

@Injectable()
export class NestRequestLoggerMiddleware implements NestMiddleware {
  use (req: Request, res: Response, next: Function) {
    next()
    const body = !!Object.keys(req.body).length ? ' ' + JSON.stringify(req.body) : ''
    this.logger.log(req.method + ' ' + req.url + body)
  }

  @Cached()
  private get logger () {
    return AppContainer.get(AppLoggerTkn)
  }
}
