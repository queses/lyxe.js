import { BaseWriteRepository } from './BaseWriteRepository'
import { createQueryBuilder, SelectQueryBuilder } from 'typeorm'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/lyxe-persistence'
import { IRepository } from '../persistence/IRepository'

export const ENTITY_ALIAS = 'e'

export abstract class BaseRepository <T extends IHasId<ID>, ID extends TPersistenceId>
  extends BaseWriteRepository<T, ID>
  implements IRepository<T, ID>
{
  private repoCacheEnabled = false
  private _queryCacheConfigured: boolean

  public cache (toCache: boolean = true): this {
    this.repoCacheEnabled = toCache
    return this
  }

  public count () {
    const q = this.queryBuilder()
    return this.countEntities(q)
  }

  public existsById (id: ID) {
    const q = this.queryBuilder().whereInIds(id)
    return this.entityExists(q)
  }

  public findAll () {
    return this.queryEntities()
  }

  public findById (id: ID) {
    const q = this.queryBuilder().whereInIds(id)
    return this.queryEntity(q)
  }

  public async findByIds (ids: ID[]) {
    if (!Array.isArray(ids) || !ids.length) {
      return []
    } else {
      return this.sortResultByIds(await this.queryEntities(this.queryBuilder().whereInIds(ids)), ids)
    }
  }

  public refresh (entity: T): Promise<T> {
    return this.findById(entity.getId()) as Promise<T>
  }

  protected queryEntities (q?: SelectQueryBuilder<T>) {
    q = this.setCacheOptionsToQuery(q)
    return q.getMany()
  }

  protected queryRawEntities <U extends any> (q?: SelectQueryBuilder<T>): Promise<U[]> {
    q = this.setCacheOptionsToQuery(q)
    return q.getRawMany()
  }

  protected queryEntity (q?: SelectQueryBuilder<T>) {
    q = this.setCacheOptionsToQuery(q)
    return q.getOne()
  }

  protected queryRawEntity <U extends any> (q?: SelectQueryBuilder<T>): Promise<U> {
    q = this.setCacheOptionsToQuery(q)
    return q.getRawOne()
  }

  protected countEntities (q?: SelectQueryBuilder<T>) {
    q = this.setCacheOptionsToQuery(q)
    return q.getCount()
  }

  protected async entityExists (q?: SelectQueryBuilder<T>) {
    if (!q) {
      q = this.queryBuilder()
    }

    return (await this.countEntities(q) > 0)
  }

  protected queryBuilder (): SelectQueryBuilder<T> {
    const q = (this.manager)
      ? this.manager.createQueryBuilder(this.entityClass, ENTITY_ALIAS)
      : createQueryBuilder(this.entityClass, ENTITY_ALIAS)

    return (this.shouldBeCached) ? q.cache(true) : q
  }

  protected setCacheOptionsToQuery (q?: SelectQueryBuilder<T>) {
    if (!q) {
      return this.queryBuilder()
    }

    return (this.shouldBeCached) ? q.cache(true) : q
  }

  protected get shouldBeCached () {
    if (!this.repoCacheEnabled) {
      return false
    }

    if (typeof this._queryCacheConfigured === 'undefined') {
      this._queryCacheConfigured = !!this.manager.connection.options.cache
    }

    return this._queryCacheConfigured
  }
}
