import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/luxe-persistence'
import { IWriteRepository } from '../persistence/IWriteRepository'
import { EntityManager, ObjectType } from 'typeorm'

export abstract class BaseWriteRepository <T extends IHasId<ID>, ID extends TPersistenceId> implements IWriteRepository<T, ID> {
  private readonly _manager: EntityManager

  protected abstract get entityClass (): ObjectType<T>

  protected get manager () { return this._manager }

  protected constructor (manager: EntityManager) {
    this._manager = manager
  }

  public save (entity: T) {
    return this.manager.save(entity)
  }

  public saveMany (entities: T[]) {
    return this.manager.save(entities)
  }

  public async delete (entity: T) {
    await this.deleteById(entity.getId())
  }

  public async deleteAll () {
    await this.manager.delete(this.entityClass, {})
  }

  public async deleteMany (entities: T[]) {
    await this.manager.delete(this.entityClass, entities.map(entity => entity.getId()) as any[])
  }

  public async deleteById (id: ID) {
    await this.manager.delete(this.entityClass, id)
  }

  protected sortResultByIds (data: T[], ids: ID[]) {
    const dataIdsMap: Map<ID, number> = new Map()
    data.forEach((item, index) => dataIdsMap.set(item.getId(), index))

    const result: T[] = []
    for (const id of ids) {
      result.push(data[dataIdsMap.get(id) as number])
    }

    return result
  }
}
