import { IRepository } from '../persistence/IRepository'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/lyxe-persistence'
import Token from '../core/di/Token'
import { AppCacheTkn } from '../cache/lyxe-cache-tokens'
import { RepositoryFactoryTkn } from '../persistence/lyxe-persistence-tokens'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { InjectService } from '../core/di/annotations/InjectService'
import { IRepositoryFactory } from '../persistence/IRepositoryFactory'
import { IAppCache } from '../cache/IAppCache'

@SingletonService()
export class WebPersistenceCache {
  @InjectService(RepositoryFactoryTkn)
  private repositoryFactory: IRepositoryFactory

  @InjectService(AppCacheTkn)
  private appCache: IAppCache

  async ofData <T extends Record<string, unknown>> (key: string, ttlSec: number, getData: () => Promise<T>): Promise<T> {
    const fullKey = 'web-domain-data-cache:' + key
    let data = await this.appCache.get<T>(fullKey)
    if (!data) {
      data = await getData()
      this.appCache.set(fullKey, data, ttlSec).catch(err => { throw err })
    }

    return data
  }

  async ofEntities <E extends IHasId<ID>, ID extends TPersistenceId> (
    key: string,
    ttl: number,
    repoTkn: Token<IRepository<E, ID>>,
    getData: () => Promise<E[] | E>
  ): Promise<E[]> {
    const fullKey = 'web-domain-entities-cache:' + key
    const cached = await this.appCache.get<ID[]>(fullKey)

    if (Array.isArray(cached)) {
      return this.repositoryFactory.get(repoTkn).findByIds(cached)
    } else {
      const data: E[] = await getData().then(data => Array.isArray(data) ? data : [ data ])
      if (data[0]) {
        const ids: ID[] = []
        for (const entity of data) {
          ids.push(entity.getId())
        }

        this.appCache.set(fullKey, ids, ttl).catch(err => { throw err })
      }

      return data
    }
  }
}
