import { Page } from '../persistence/Page'
import { SelectQueryBuilder } from 'typeorm'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId, TSortOrder } from '../persistence/lyxe-persistence'
import { BaseRepository, ENTITY_ALIAS } from './BaseRepository'
import { IConfigurableRepository } from '../persistence/IConfigurableRepository'
import { SearchConfig } from '../persistence/SearchConfig'
import { PageConfig } from '../persistence/PageConfig'

export abstract class ConfigurableRepository
  <T extends IHasId<ID>, ID extends TPersistenceId, C extends SearchConfig = SearchConfig>
  extends BaseRepository<T, ID>
  implements IConfigurableRepository<T, ID>
{
  public transformQuery (q: SelectQueryBuilder<T>, config: SearchConfig | undefined) {
    return
  }

  public count (config?: C) {
    const q = this.queryBuilder()
    return this.countEntities(q, config)
  }

  public existsById (id: ID, config?: C) {
    const q = this.queryBuilder().whereInIds(id)
    return this.entityExists(q, config)
  }

  public findAll (config?: C) {
    const q = this.queryBuilder()
    return this.queryEntities(q, config)
  }

  public findById (id: ID, config?: C) {
    const q = this.queryBuilder().whereInIds(id)
    return this.queryEntity(q, config)
  }

  public async findByIds (ids: ID[], config?: C) {
    if (!Array.isArray(ids) || !ids.length) {
      const pageSize = (config && config.page) ? config.page.size : 0
      return this.createPage([], 1, pageSize, 0)
    } else {
      return this.sortResultByIds(await this.queryEntities(this.queryBuilder().whereInIds(ids), config), ids)
    }
  }

  protected async queryEntities (q?: SelectQueryBuilder<T>, config?: C) {
    let pageConfig: PageConfig | undefined
    if (config instanceof SearchConfig) {
      pageConfig = config.page
      q = this.applyConfigToQuery(q, config)
    }

    return this.getPageFromValues(await super.queryEntities(q), q as SelectQueryBuilder<T>, pageConfig)
  }

  protected async queryRawEntities <U extends any> (q?: SelectQueryBuilder<T>, config?: C): Promise<Page<U>> {
    let pageOptions: PageConfig | undefined
    if (config instanceof SearchConfig) {
      pageOptions = config.page
    }

    q = this.applyConfigToQuery(q, config)
    return this.getPageFromValues(await super.queryRawEntities(q), q as SelectQueryBuilder<T>, pageOptions)
  }

  protected queryEntity (q?: SelectQueryBuilder<T>, config?: C) {
    q = this.applyConfigToQuery(q, config)
    return super.queryEntity(q)
  }

  protected queryRawEntity <U extends any> (q?: SelectQueryBuilder<T>, config?: C): Promise<U> {
    q = this.applyConfigToQuery(q, config)
    return super.queryRawEntity(q)
  }

  protected countEntities (q?: SelectQueryBuilder<T>, config?: C) {
    q = this.applyConfigToQuery(q, config)

    return q.getCount()
  }

  protected async entityExists (q?: SelectQueryBuilder<T>, config?: C) {
    q = this.applyConfigToQuery(q, config)

    return (await q.getCount()) > 0
  }

  protected emptyPage (config?: C): Page<T> {
    const pageSize = config?.page?.size || 0
    return this.createPage([], 1, pageSize, 0)
  }

  private applyConfigToQuery (q: SelectQueryBuilder<T> | undefined, config?: C) {
    if (!q) {
      q = this.queryBuilder()
    }

    this.transformQuery(q, config)

    const { sortOptions, sortRelations, page } = config || {} as C
    if (sortOptions) {
      const orderBy: { [key: string]: TSortOrder } = {}
      Object.keys(sortOptions).forEach((attr) => {
        const relationName = sortRelations[attr]
        if (relationName) {
          if (!this.getQueryHasAlias(q as SelectQueryBuilder<T>, relationName)) {
            (q as SelectQueryBuilder<T>).leftJoinAndSelect(`${ENTITY_ALIAS}.${relationName}`, relationName)
          }

          orderBy[attr] = sortOptions[attr]
        } else {
          orderBy[`${ENTITY_ALIAS}.${attr}`] = sortOptions[attr]
        }
      })

      q.orderBy(orderBy)
    }

    if (page) {
      q.skip(page.skip).take(page.size)
    }

    return q
  }

  private async getPageFromValues <V> (values: V[], q: SelectQueryBuilder<T>, pageConfig?: PageConfig) {
    return (pageConfig instanceof PageConfig)
      ? this.createPage(values, pageConfig.current, pageConfig.size, await q.getCount())
      : this.createPage(values, 1, values.length, values.length)
  }

  private createPage <V> (values: V[], currentPage: number, pageSize: number, totalElements: number) {
    Reflect.setPrototypeOf(values, Page.prototype)
    return (values as Page<V>).configurePage(currentPage, pageSize, totalElements)
  }

  private getQueryHasAlias (q: SelectQueryBuilder<T>, aliasName: string): boolean {
    return (q.expressionMap.aliases.findIndex(item => item.name === aliasName) >= 0)
  }
}
