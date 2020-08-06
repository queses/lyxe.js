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
      limiter = this.createLimiter(limiterKey, maxRate, inSeconds)
      this.limiters.set(limiterKey, limiter)
    }

    try {
      await limiter.consume(clientId)
    } catch (err) {
      throw new ResourceTemporaryUnavailableError(message)
    }
  }

  private createLimiter (keyPrefix: string, points: number, duration: number) {
    if (AppConfigurator.get('redis.enabled')) {
      return new RateLimiterRedis({
        points,
        duration,
        keyPrefix,
        storeClient: this.redisClient,
      })
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
