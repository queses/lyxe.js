import { RateLimiterAbstract, RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible'
import * as redis from 'redis'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { ResourceTemporaryUnavailableError } from '../core/application-errors/ResourceTemporaryUnavailableError'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { Cached } from '../core/lang/annotations/Cached'

@SingletonService()
export class WebRateLimiter {
  private limiters: Map<string, RateLimiterAbstract> = new Map()

  public async limit (clientId: string, limiterKey: string, maxRate: number, inSeconds: number = 1, message?: string) {
    let limiter = this.limiters.get(limiterKey)
    if (!limiter) {
      limiter = await this.createLimiter(limiterKey, maxRate, inSeconds)
      this.limiters.set(limiterKey, limiter)
    }

    await limiter.consume(clientId).catch((err) => {
      if (err instanceof Error) {
        throw err
      } else {
        throw new ResourceTemporaryUnavailableError(message)
      }
    })
  }

  private async createLimiter (keyPrefix: string, points: number, duration: number) {
    if (AppConfigurator.get('redis.enabled')) {
      const limiter = new RateLimiterRedis({
        points,
        duration,
        keyPrefix,
        storeClient: this.redisClient,
      })

      // Waiting 500ms till redis connection established
      return new Promise(r => setTimeout(r, 500)).then(() => limiter)
    } else {
      return new RateLimiterMemory({
        points,
        duration
      })
    }
  }

  @Cached()
  private get redisClient () {
    return redis.createClient({
      /* eslint @typescript-eslint/camelcase: off */
      enable_offline_queue: false
    })
  }
}
