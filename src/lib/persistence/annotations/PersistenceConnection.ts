import { TPersistenceConnectionName } from '../lyxe-persistence'
import { TClass } from '../../core/di/lyxe-di'
import { IPersistenceConnection } from '../IPersistenceConnection'
import { PersistenceConnectionRegistry } from '../PersistenceConnectionRegistry'
import { AppContainer } from '../../core/di/AppContainer'
import { injectable } from 'inversify'

export const PersistenceConnection = (name: TPersistenceConnectionName) => (target: TClass<IPersistenceConnection>) => {
  AppContainer.get(PersistenceConnectionRegistry).add(name, target)
  return injectable()(target)
}
