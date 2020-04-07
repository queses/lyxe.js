import { IEntityManager } from './IEntityManager'

export interface IPersistenceConnection {
  connect (): Promise<void>
  close (): Promise<void>
  getManager (): IEntityManager
  transaction? <T> (run: (transactional: IEntityManager) => Promise<T>): Promise<T>
  nestedTransaction? <T> (parent: IEntityManager, run: (transactional: IEntityManager) => Promise<T>): Promise<T>
}
