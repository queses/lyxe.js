import { ConsoleDevController } from '../../console/annotations/ConsoleDevController'
import { InjectService } from '../../core/di/annotations/InjectService'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import { DomainFixtureLoader } from '../fixture/DomainFixtureLoader'
import { DefaultPersistenceTkn } from '../../persistence/luxe-persistence-tokens'
import { IPersistenceConnection } from '../../persistence/IPersistenceConnection'

@ConsoleDevController('lx:fixture')
export class FixtureController {
  @InjectService(DomainFixtureLoader)
  private fixtureLoader: DomainFixtureLoader

  @InjectService(DefaultPersistenceTkn)
  private defaultConnection: IPersistenceConnection

  @ConsoleAction('persist', 'Persist all domain fixtures with default persistence connection')
  public loadFixtures () {
    return this.defaultConnection.clearStorage().then(() => this.fixtureLoader.persistFixtures())
  }

  @ConsoleAction('clear', 'Drop all data from the storage with default persistence connection')
  public async drop () {
    return this.defaultConnection.clearStorage()
  }
}
