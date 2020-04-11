import { IEntityManager } from '../../persistence/IEntityManager'
import { IDomainFixture } from './IDomainFixture'
import { TClass, TServiceId } from '../../core/di/luxe-di'
import { AppError } from '../../core/application-errors/AppError'
import { IHasId } from '../../persistence/IHasId'
import { AppPathUtil } from '../../core/config/AppPathUtil'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { IPersistenceConnection } from '../../persistence/IPersistenceConnection'
import { AppContainer } from '../../core/di/AppContainer'
import { DefaultPersistenceTkn } from '../../persistence/luxe-persistence-tokens'

@SingletonService()
export class DomainFixtureLoader {
  private loaded: WeakMap<TClass<IDomainFixture>, number> = new WeakMap()
  private dataInserted: WeakMap<TClass<IDomainFixture>, boolean> = new WeakMap()

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

    return this.load(fixturesClasses as any, entityManager)
  }

  public loadInModules (modules: string[], entityManager: IEntityManager): Promise<void> {
    const wildcard = (modules.length < 2) ? modules[0] : `@(${modules.join('|')})`
    return wildcard ? this.loadAll(entityManager, wildcard) : Promise.resolve()
  }

  public persistFixtures (connectionId?: TServiceId<IPersistenceConnection>, onlyInModules?: string[]): Promise<void> {
    const connection = AppContainer.get(connectionId || DefaultPersistenceTkn)
    if (Array.isArray(onlyInModules)) {
      return this.loadInModules(onlyInModules, connection.getManager())
    } else {
      return this.loadAll(connection.getManager())
    }
  }

  private async loadFixture (fixtureClass: TClass<IDomainFixture>, entityManager: IEntityManager) {
    if (!fixtureClass.prototype || fixtureClass.prototype['getEntities' as keyof IDomainFixture] !== 'function') {
      return
    }

    const loaded = this.loaded.get(fixtureClass) || 0
    if (this.dataInserted.has(fixtureClass)) {
      this.loaded.set(fixtureClass, loaded + 1)
      return
    } else if (loaded) {
      throw new AppError(`Domain fixture circular dependency appeared in '${fixtureClass.name}'`)
    }

    this.loaded.set(fixtureClass, 1)

    const fixture = new fixtureClass()
    if (Array.isArray(fixture.depends) && fixture.depends.length) {
      for (const depFixtureClass of fixture.depends) {
        await this.loadFixture(depFixtureClass, entityManager)
      }
    }

    if (Array.isArray(fixture.dependsOnModules) && fixture.dependsOnModules.length) {
      await this.loadInModules(fixture.dependsOnModules, entityManager)
    }

    const models: IHasId[] = Object.values(await fixture.getEntities())
    await entityManager.save(models)

    this.dataInserted.set(fixtureClass, true)
  }
}
