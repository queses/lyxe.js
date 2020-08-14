import { IEntityManager } from '../persistence/IEntityManager'
import { TBaseContextInfo } from '../core/context/lyxe-context-info'
import { ServiceFactory } from 'lyxe/lib/core/context/ServiceFactory'

export type TMochaTransactionalTest <C extends TBaseContextInfo> = (
  this: Mocha.Context,
  serviceFactory: ServiceFactory<C>,
  entityManager: IEntityManager
) => void
