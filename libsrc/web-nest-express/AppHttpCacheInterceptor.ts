import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AppHttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest<Request>()
    const query = JSON.stringify(req.query)
    const auth = req.header('Authorization') || ''

    return `${req.url}__${query}__${auth}`
  }
}
