import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { NextFunction, Request, Response } from 'express'
import * as cache from 'cache-manager'
import { Cached } from '../core/lang/annotations/Cached'
import { TObjectLiteral } from '../core/lang/lyxe-lang'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'

export class ExpressCacheMiddleware {
  private ttl = 3
  private max = 120

  public static ttl (value: number) {
    if (value < 0) {
      throw new InvalidArgumentError('Caching "ttl" value should be greater or equal 0')
    }

    this.inst.ttl = value
  }

  public static max (value: number) {
    if (value < 0) {
      throw new InvalidArgumentError('Caching "max" value should be greater or equal 0')
    }

    this.inst.max = value
  }

  public static handler = (req: Request, res: Response, next: NextFunction) => {
    ExpressCacheMiddleware.inst.handle(req, res, next).catch(err => next(err))
  }

  private async handle (req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') {
      next()
      return
    }

    const key = this.getKey(req)
    const cached = await this.getCachedRes(key)
    if (cached && cached.status < 500) {
      res.status(cached.status)
      for (const header of Object.keys(cached.headers)) {
        res.header(header, cached.headers[header])
      }

      res.send(cached.body)
    } else {
      this.monkeyPatchRes(key, res)
      next()
    }
  }


  private getKey (req: Request) {
    const auth = req.header('Authorization') || ''
    return `web:express:cache:${req.url}__${auth}`
  }

  private getCachedRes (key: string): Promise<{ status: number, headers: TObjectLiteral, body?: string | Buffer } | undefined> {
    return this.cacheManager.get(key)
  }

  private monkeyPatchRes (key: string, res: Response) {
    const write = res.write
    const end = res.end
    let chunks: any[] | undefined

    res.write = (chunk: any, encodingOrCb?: any, cb?: any) => {
      if (!chunks) {
        chunks = [ chunk ]
      } else {
        chunks.push(chunk)
      }

      return write.apply(res, [chunk, encodingOrCb, cb])
    }

    res.end = (chunk?: any, encodingOrCb?: any, cb?: any) => {
      let content: Buffer | string | undefined = chunk
      if (chunks) {
        if (chunk) {
          chunks.push(chunk)
        }

        content = (chunk[0] instanceof Buffer) ? Buffer.concat(chunks) : chunks.join('')
        chunks = undefined
      }

      this.cacheRes(key, res.statusCode, res.getHeaders(), content)
      return end.apply(res, [chunk, encodingOrCb, cb])
    }
  }

  private cacheRes (key: string, status: number, headers: TObjectLiteral, body: string | Buffer | undefined): void {
    this.cacheManager.set(key, { status, headers, body }, { ttl: this.ttl }).catch((err: Error) => {
      this.logger.error(err.message, err.stack)
    })
  }

  @Cached()
  private get logger () {
    return AppContainer.get(AppLoggerTkn)
  }

  @Cached()
  private get cacheManager () {
    const conf: cache.StoreConfig = {
      ttl: this.max,
      max: this.max,
      store: 'memory'
    }

    return cache.caching(conf)
  }

  private static get inst (): ExpressCacheMiddleware {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}