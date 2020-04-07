import { TClass, TServiceId } from '../../core/di/luxe-di'
import { IUseCase } from '../../core/context/IUseCase'
import { IPersistenceConnection } from '../IPersistenceConnection'
import { AppContainer } from '../../core/di/AppContainer'
import { DefaultPersistenceTkn } from '../luxe-persistence-tokens'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { TransientService } from '../../core/di/annotations/TransientService'
import { IEntityManager } from '../IEntityManager'
import { PersistenceContextMeta } from '../PersistenceContextMeta'

export const TransactionalUseCase = (
  id?: TServiceId<IUseCase>, connectionId?: TServiceId<IPersistenceConnection>
) => (target: TClass<IUseCase>) => {
  const runMethodName: keyof IUseCase = 'run'
  const runMethod: Function = Reflect.get(target.prototype, runMethodName)

  Reflect.set(target.prototype, runMethodName, async function <A = any> (this: IUseCase, ...args: A[]) {
    const connection = (connectionId) ? AppContainer.get(connectionId) : AppContainer.get(DefaultPersistenceTkn)
    if (!connection.nestedTransaction || !connection.transaction) {
      throw new InvalidArgumentError('Trying to start UseCase transaction with non-transactional connection')
    }

    const oldEm: IEntityManager | undefined = (this.contextInfo)
      ? Reflect.getMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, this.contextInfo)
      : undefined

    const run = async (transactionalEm: IEntityManager) => {
      if (!this.contextInfo) {
        this.contextInfo = {}
      }

      Reflect.defineMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, transactionalEm, this.contextInfo)
      const result = await Reflect.apply(runMethod, this, args)
      Reflect.defineMetadata(PersistenceContextMeta.TRANSACTIONAL_EM, oldEm, this.contextInfo)

      return result
    }

    return (oldEm) ? connection.nestedTransaction(oldEm, run) : connection.transaction(run)
  })
  
  return TransientService(id)(target)
}


