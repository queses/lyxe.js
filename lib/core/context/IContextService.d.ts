import { TBaseContextInfo } from './luxe-context-info'
import { IUseCase } from './IUseCase'
import { IReadService } from './IReadService'
import { TServiceId } from '../di/luxe-di'

export interface IContextService <C extends TBaseContextInfo = TBaseContextInfo> {
  configure (context: C | undefined): this
  contextInfo?: C
}

export interface IServiceFactory <C extends TBaseContextInfo = TBaseContextInfo> extends IContextService<C> {
  createUseCase <T extends IUseCase<C>> (id: TServiceId<T>): T
  createReadService <T extends IReadService<C>> (id: TServiceId<T>): T
  createService <T extends IContextService<C>> (id: TServiceId<T>): T
}
