import { ConsoleDevController } from '../../console/annotations/ConsoleDevController'
import { InjectService } from '../../core/di/annotations/InjectService'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import { DomainFixtureLoader } from '../fixture/DomainFixtureLoader'
import { TPersistenceConnectionName } from '../../persistence/luxe-persistence'
import { PersistenceConnectionRegistry } from '../../persistence/PersistenceConnectionRegistry'

@ConsoleDevController('lx:fixture')
export class FixtureController {
  @InjectService(DomainFixtureLoader)
  private fixtureLoader: DomainFixtureLoader

  @ConsoleAction('persist', 'Persist all domain fixtures with defined persistence connection')
  public loadFixtures (args: string[]) {
    const connectionName: TPersistenceConnectionName = args[0] || 'default'
    const connection = PersistenceConnectionRegistry.get(connectionName)
    return connection.clearStorage().then(() => this.fixtureLoader.persistFixtures())
  }

  @ConsoleAction('clear', 'Drop all data from the storage with defined persistence connection')
  public async drop (args: string[]) {
    const connectionName: TPersistenceConnectionName = args[0] || 'default'
    return PersistenceConnectionRegistry.get(connectionName).clearStorage()
  }
}
