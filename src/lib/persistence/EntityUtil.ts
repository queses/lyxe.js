import { IHasId } from './IHasId'
import { DomainEntityNotFoundError } from '../core/domain-errors/DomainEntityNotFoundError'
import { SearchConfig } from './SearchConfig'
import { IRepository } from './IRepository'
import { TPagePromise } from './lyxe-persistence'
import { TClass } from '../core/di/lyxe-di'

export class EntityUtil {
  static throwIfNotFound <T extends IHasId> (entity: T, classOrMsg: TClass<T> | string): T {
    if (!entity) {
      throw new DomainEntityNotFoundError(classOrMsg as TClass<T> | string)
    }

    return entity
  }

  static async throwIfNotFoundAsync <T extends IHasId> (entityPromise: Promise<T>, entityClassOrMsg: TClass<T> | string) {
    return this.throwIfNotFound(await entityPromise, entityClassOrMsg)
  }

  static async processAndSaveInChunks <E extends IHasId, S extends SearchConfig, R extends IRepository<E, any>> (
    so: S, repo: R, search: (so: S) => TPagePromise<E>, handle: (item: E) => any | Promise<any>
  ) {
    while (true) {
      const chunk = await search(so)
      if (!chunk.length) {
        return
      }

      if (so.page) {
        so.page.nextPage()
      }

      await Promise.all(chunk.map(handle))

      await repo.saveMany(chunk)
    }
  }

  static async processInChunks <E extends IHasId, S extends SearchConfig, R extends IRepository<E, any>> (
    so: S,
    search: (so: S) => TPagePromise<E>,
    handle: (item: E) => any | Promise<any>
  ): Promise<void> {
    while (true) {
      const chunk = await search(so)
      if (!chunk.length) {
        return
      }

      if (so.page) {
        so.page.nextPage()
      }

      await Promise.all(chunk.map(handle))
    }
  }

  static mapToDto <D extends object, E extends object = object> (entity: E, extra?: Partial<D> | any): D | undefined {
    if (!entity || !entity.constructor) {
      return undefined
    }

    const dto = {} as D

    let proto = Object.getPrototypeOf(entity)
    // Выполняем цикл пока proto не null или пока proto не присвоен базововый прототип (у него есть метод valueOf)
    while (proto && !proto.hasOwnProperty('valueOf')) {
      this.parseKeysForDto(Object.getOwnPropertyNames(proto) as string[], dto, entity, extra)
      proto = Object.getPrototypeOf(proto)
    }

    return extra ? Object.assign(dto, extra) : dto
  }

  private static parseKeysForDto <D extends {}, E extends {} = {}> (keys: string[], dto: D, entity: E, extra?: Partial<D>): D {
    for (const key of keys) {
      if (!key.startsWith('get')) {
        continue
      }

      const property = key[3].toLowerCase() + key.substr(4)
      if (!entity.hasOwnProperty(property) || dto.hasOwnProperty(property) || (extra && extra.hasOwnProperty(property))) {
        continue
      }

      const value = Reflect.get(entity, property)
      if (typeof value === 'undefined' || value instanceof Promise) {
        // continue
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
        Reflect.set(dto, property, value)
      } else if (Array.isArray(value)) {
        Reflect.set(dto, property, value.map((item: object) => this.mapToDto(item)))
      } else if (typeof value === 'object') {
        Reflect.set(dto, property, this.mapToDto(value))
      }
    }

    return dto
  }
}
