import { IContextService } from '../core/context/IContextService'

export interface IKeyValueContextStorage extends IContextService {
  get (key: string): Promise<string>
  set <T> (key: string, value: T): Promise<void>
  has (key: string): Promise<boolean>
}
