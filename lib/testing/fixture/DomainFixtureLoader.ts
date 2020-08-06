import { IEntityManager } from '../../persistence/IEntityManager'
import { IDomainFixture } from './IDomainFixture'
import { TClass } from '../../core/di/luxie-di'
import { AppError } from '../../core/application-errors/AppError'
import { IHasId } from '../../persistence/IHasId'
import { AppPathUtil } from '../../core/config/AppPathUtil'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'
import { TPersistenceConnectionName } from '../../persistence/luxie-persistence'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { AppContainer } from '../../core/di/AppContainer'

const META_EM_LOADED = 'domain-fixture-loader:loaded'
const META_EM_DATA_INSERTED = 'domain-fixture-loader:data-inserted'

@SingletonService()
export class DomainFixtureLoader {
  public async load (fixtures: TClass<IDomainFixture> | Array<TClass<IDomainFixture>>, entityManager: IEntityManager): Promise<void> {
    if (Array.isArray(fixtures)) {
      for (const fixtureClass of fixtures) {
        await this.loadFixture(fixtureClass, entityManager)
      }
    } else {
      await this.loadFixture(fixtures, entityManager)
    }
  }

  public async loadAll (entityManager: IEntityManager, moduleWildcard: string = '*'): Promise<void> {
    const cwd = AppPathUtil.appSrc
    const files: string[] = await AppPathUtil.globClasses(cwd, moduleWildcard + '/tests/fixtures')
    const fixturesClasses = files.map((fixturePath) => {
      if (fixturePath.includes('app/')) {
        return null
      }

      const required = require(cwd + '/' + fixturePath)
      if (typeof required === 'function') {
        return required
      } else {
        return required[Object.keys(required)[0]]
      }
    })

    for (const fixtureClass of fixturesClasses) {
      await this.loadFixture(fixtureClass, entityManager, false)
    }
  }

  public loadInModules (modules: string[], entityManager: IEntityManager): Promise<void> {
    const wildcard = (modules.length < 2) ? modules[0] : `@(${modules.join('|')})`
    return wildcard ? this.loadAll(entityManager, wildcard) : Promise.resolve()
  }

  public persistFixtures (connectionName?: TPersistenceConnectionName, onlyInModules?: string[]): Promise<void> {
    const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
    if (Array.isArray(onlyInModules)) {
      return this.loadInModules(onlyInModules, connection.getManager())
    } else {
      return this.loadAll(connection.getManager())
    }
  }

  private async loadFixture (fixtureClass: TClass<IDomainFixture>, entityManager: IEntityManager, throwOnInvalid: boolean = true) {
    if (!fixtureClass.prototype || !fixtureClass.prototype.hasOwnProperty('getEntities' as keyof IDomainFixture)) {
      if (throwOnInvalid) {
        throw new InvalidArgumentError('Invalid DomainFixture provided')
      } else {
        return
      }
    }

    const loadedMap = this.getLoadedFixturesMap(entityManager)
    const insertedDataMap = this.getInsertedDataMap(entityManager)

    const loaded = loadedMap.get(fixtureClass) || 0
    if (insertedDataMap.has(fixtureClass)) {
      loadedMap.set(fixtureClass, loaded + 1)
      return
    } else if (loaded) {
      throw new AppError(`Domain fixture circular dependency appeared in '${fixtureClass.name}'`)
    }

    loadedMap.set(fixtureClass, 1)

    const fixture = new fixtureClass()
    if (Array.isArray(fixture.depends) && fixture.depends.length) {
      for (const depFixtureClass of fixture.depends) {
        await this.loadFixture(depFixtureClass, entityManager)
      }
    }

    if (Array.isArray(fixture.dependsOnModules) && fixture.dependsOnModules.length) {
      await this.loadInModules(fixture.dependsOnModules, entityManager)
    }

    const models: IHasId[] = Object.values(await fixture.getEntities(entityManager))
    await entityManager.save(models)

    insertedDataMap.set(fixtureClass, true)
  }

  private getLoadedFixturesMap (entityManager: IEntityManager) {
    let map: WeakMap<TClass<IDomainFixture>, number> = Reflect.getMetadata(META_EM_LOADED, entityManager)
    if (!map) {
      map = new WeakMap()
      Reflect.defineMetadata(META_EM_LOADED, map, entityManager)
    }

    return map
  }

  private getInsertedDataMap (entityManager: IEntityManager) {
    let map: WeakMap<TClass<IDomainFixture>, boolean> = Reflect.getMetadata(META_EM_LOADED, entityManager)
    if (!map) {
      map = new WeakMap()
      Reflect.defineMetadata(META_EM_DATA_INSERTED, map, entityManager)
    }

    return map
  }
}
