import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AppHttpCacheInterceptor extends CacheInterceptor {
  trackBy (context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>()
    if (req.method !== 'GET') {
      return undefined
    }

    const auth = req.header('Authorization') || ''
    return `${req.url}__${auth}`
  }
}
