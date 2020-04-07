import { IHasId } from '../IHasId'
import { TPersistenceId } from '../luxe-persistence'
import { IRepository } from '../IRepository'
import { TClass, TServiceId } from '../../core/di/luxe-di'
import { AppContainer } from '../../core/di/AppContainer'
import { RepositoryFactoryTkn } from '../luxe-persistence-tokens'
import { IContextService } from '../../core/context/IContextService'
import { IEntityManager } from '../IEntityManager'
import { PersistenceContextMeta } from '../PersistenceContextMeta'

export const InjectRepository = <
  R extends IRepository<T, ID>,
  T extends IHasId<ID>,
  ID extends TPersistenceId
> (id: TServiceId<R>) => (target: TClass<IContextService>, name: string) => {
  Object.defineProperty(target, name, {
    get (this: IContextService) {
      const em: IEntityManager | undefined = (this.contextInfo)
        ? Reflect.getMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, this.contextInfo)
        : undefined

      const value = AppContainer.get(RepositoryFactoryTkn).get(id, em)
      Object.defineProperty(this, name, { value })
      return value
    },
    set () {}
  })
}

