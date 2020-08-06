import { SingletonService } from '../../core/di/annotations/SingletonService'
import { AppCacheTkn } from '../lyxe-cache-tokens'
import { IAppCache } from '../IAppCache'
import * as cache from 'cache-manager'
import { AppConfigurator } from '../../core/config/AppConfigurator'
import { PromiseUtil } from '../../core/lang/PromiseUtil'

const DEFAULT_TTL = 3600
const DEFAULT_MAX_IN_MEMORY = 999
const DEFAULT_MAX_IN_REDIS = 9999

@SingletonService(AppCacheTkn)
export class CacheManagerAppCache implements IAppCache {
  private manager: cache.Cache
  private readonly keyPrefix: string = ''

  constructor () {
    const redisEnabled = AppConfigurator.get<boolean>('redis.enabled')

    const conf: cache.StoreConfig | any = {
      ttl: DEFAULT_TTL,
      store: 'memory',
      max: redisEnabled ? DEFAULT_MAX_IN_REDIS : DEFAULT_MAX_IN_MEMORY
    }

    if (redisEnabled) {
      conf.store = require('cache-manager-redis')
      conf.host = AppConfigurator.get<string>('redis.host')
      conf.port = AppConfigurator.get<number>('redis.port')
      conf.db = AppConfigurator.get<number>('redis.db')
      this.keyPrefix = AppConfigurator.get<string>('redis.prefixCache')
    }

    this.manager = cache.caching(conf)
  }

  public get <V> (key: string): Promise<V> {
    return PromiseUtil.timeoutExecution(this.manager.get(this.prefixKey(key)), 'getting from app cache')
  }

  public set <V> (key: string, value: V, ttl: number = DEFAULT_TTL): Promise<void> {
    return PromiseUtil.timeoutExecution(this.manager.set(this.prefixKey(key), value, { ttl }), 'setting to app cache')
  }

  public delete (key: string): Promise<void> {
    return PromiseUtil.timeoutExecution(this.manager.del(this.prefixKey(key)), 'deleting value from app cache')
  }

  private prefixKey (key: string) {
    return this.keyPrefix + key
  }
}
