import { IUseCase } from '../../../lib/core/context/IUseCase'

export interface IHelloWorldUseCase extends IUseCase {
  run (): Promise<string>
}

export interface IParentTransactionalUseCase extends IUseCase {
  run (toThrow?: boolean, toThrowChild?: boolean): Promise<void>
}

export interface IChildTransactionalUseCase extends IUseCase {
  run (toThrowChild?: boolean): Promise<void>
}

