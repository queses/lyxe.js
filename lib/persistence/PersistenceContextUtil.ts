import { IContextService } from '../core/context/IContextService'
import { IEntityManager } from './IEntityManager'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { IHasId } from './IHasId'
import { TPersistenceId } from './luxie-persistence'
import { IRepository } from './IRepository'
import { AppContainer } from '../core/di/AppContainer'
import { RepositoryFactoryTkn } from './luxie-persistence-tokens'
import Token from '../core/di/Token'

export class PersistenceContextUtil {
  public static getTransactionalEm (service: IContextService): IEntityManager {
    return service.contextInfo
      ? Reflect.getMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, service.contextInfo)
      : undefined
  }

  public static setTransactionalEm (service: IContextService, em: IEntityManager) {
    if (!service.contextInfo) {
      throw new InvalidArgumentError('Cannot write transactional entity manager to context: context is undefined')
    }

    Reflect.defineMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, em, service.contextInfo)
  }

  public static createRepo <R extends IRepository<E, ID>, E extends IHasId<ID>, ID extends TPersistenceId> (
    id: Token<R>,
    service: IContextService
  ): R {
    return AppContainer.get(RepositoryFactoryTkn).get(id, this.getTransactionalEm(service))
  }
}

enum PersistenceContextMeta {
  TRANSACTIONAL_EM = 'transactional-em'
}
