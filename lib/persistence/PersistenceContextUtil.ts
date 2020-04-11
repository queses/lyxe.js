import { IContextService } from '../core/context/IContextService'
import { IEntityManager } from './IEntityManager'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'

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
}

enum PersistenceContextMeta {
  TRANSACTIONAL_EM = 'transactional-em'
}