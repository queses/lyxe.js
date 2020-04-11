import { IHasId } from '../IHasId'
import { TPersistenceId } from '../luxe-persistence'
import { IRepository } from '../IRepository'
import { TServiceId } from '../../core/di/luxe-di'
import { AppContainer } from '../../core/di/AppContainer'
import { RepositoryFactoryTkn } from '../luxe-persistence-tokens'
import { IContextService } from '../../core/context/IContextService'
import { PersistenceContextUtil } from '../PersistenceContextUtil'

export const InjectRepository = <
  R extends IRepository<T, ID>,
  T extends IHasId<ID>,
  ID extends TPersistenceId
> (id: TServiceId<R>) => (target: IContextService, name: string) => {
  Object.defineProperty(target, name, {
    get (this: IContextService) {
      const value = AppContainer.get(RepositoryFactoryTkn).get(id, PersistenceContextUtil.getTransactionalEm(this))
      Object.defineProperty(this, name, { value })
      return value
    },
    set () {}
  })
}

