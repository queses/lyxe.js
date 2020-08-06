import { TClass, TServiceId } from '../../core/di/luxie-di'
import { IUseCase } from '../../core/context/IUseCase'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { TransientService } from '../../core/di/annotations/TransientService'
import { PersistenceConnectionRegistry } from '../PersistenceConnectionRegistry'
import { TPersistenceConnectionName } from '../luxie-persistence'
import { PersistenceContextUtil } from '../PersistenceContextUtil'
import { AppContainer } from '../../core/di/AppContainer'

export const TransactionalUseCase = (
  id?: TServiceId<IUseCase>,
  connectionName?: TPersistenceConnectionName
) => (target: TClass<IUseCase>) => {
  const runMethodName: keyof IUseCase = 'run'
  const runMethod: Function = Reflect.get(target.prototype, runMethodName)

  Reflect.set(target.prototype, runMethodName, async function (this: IUseCase, ...args: any[]) {
    const connection = AppContainer.get(PersistenceConnectionRegistry).get(connectionName)
    if (!connection.beginTransaction || !connection.commitTransaction || !connection.rollbackTransaction) {
      throw new InvalidArgumentError('Trying to start UseCase transaction with non-transactional connection')
    } else if (!this.contextInfo) {
      throw new InvalidArgumentError('Cannot start transaction in UseCase without context')
    }

    const currentTransactionEm = PersistenceContextUtil.getTransactionalEm(this)
    const transactionalEm = await connection.beginTransaction(currentTransactionEm)
    PersistenceContextUtil.setTransactionalEm(this, transactionalEm)

    let result: void | any
    try {
      result = await Reflect.apply(runMethod, this, args)
    } catch (e) {
      await connection.rollbackTransaction(transactionalEm)
      throw e
    } finally {
      PersistenceContextUtil.setTransactionalEm(this, currentTransactionEm)
    }

    await connection.commitTransaction(transactionalEm)
    return result
  })
  
  return TransientService(id)(target)
}


