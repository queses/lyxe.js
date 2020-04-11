import { TPersistenceConnectionName } from '../luxe-persistence'
import { TClass } from '../../core/di/luxe-di'
import { IPersistenceConnection } from '../IPersistenceConnection'
import { PersistenceConnectionRegistry } from '../PersistenceConnectionRegistry'
import { SingletonService } from '../../core/di/annotations/SingletonService'

export const PersistenceConnection = (name: TPersistenceConnectionName) => (target: TClass<IPersistenceConnection>) => {
  PersistenceConnectionRegistry.inst.add(name, target)
  return SingletonService()(target)
}
