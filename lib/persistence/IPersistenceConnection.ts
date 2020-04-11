import { IEntityManager } from './IEntityManager'

export interface IPersistenceConnection {
  connect (): Promise<void>
  close (): Promise<void>
  getManager (): IEntityManager
  clearStorage (): Promise<void>
  beginTransaction? <T> (currentTransactionEntityManager?: IEntityManager): Promise<IEntityManager>
  commitTransaction? <T> (entityManager: IEntityManager): Promise<void>
  rollbackTransaction? <T> (entityManager: IEntityManager): Promise<void>
}
