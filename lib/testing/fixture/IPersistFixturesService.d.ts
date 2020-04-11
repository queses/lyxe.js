import { IPersistenceConnection } from '../../persistence/IPersistenceConnection'
import { TServiceId } from '../../core/di/luxe-di'

export interface IPersistFixturesService {
  persistFixtures (connectionId?: TServiceId<IPersistenceConnection>): Promise<void>
  clearStorage (connectionId?: TServiceId<IPersistenceConnection>): Promise<void>
}
