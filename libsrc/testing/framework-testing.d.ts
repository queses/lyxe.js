import { IEntityManager } from '../persistence/IEntityManager'
import { TBaseContextInfo } from '../core/context/luxie-context-info'
import { IServiceFactory } from '../core/context/IServiceFactory'

export type TMochaTransactionalTest <C extends TBaseContextInfo> = (
  this: Mocha.Context,
  serviceFactory: IServiceFactory<C>,
  entityManager: IEntityManager
) => void
