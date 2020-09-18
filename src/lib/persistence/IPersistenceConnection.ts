import { IEntityManager } from './IEntityManager'

export interface IPersistenceConnection {
  connect (): Promise<void>
  close (): Promise<void>
  getManager (): IEntityManager
  clearStorage (): Promise<void>
  beginTransaction? (currentTransactionEntityManager?: IEntityManager): Promise<IEntityManager>
  commitTransaction? (entityManager: IEntityManager): Promise<void>
  rollbackTransaction? (entityManager: IEntityManager): Promise<void>
}
