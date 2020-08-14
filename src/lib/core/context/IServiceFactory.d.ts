import { TBaseContextInfo } from './lyxe-context-info'
import { IUseCase } from './IUseCase'
import { TServiceId } from '../di/lyxe-di'
import { IReadService } from './IReadService'
import { IContextService } from './IContextService'

export interface IServiceFactory <C extends TBaseContextInfo = TBaseContextInfo> extends IContextService<C> {
  createUseCase <T extends IUseCase> (id: TServiceId<T>): T
  createReadService <T extends IReadService> (id: TServiceId<T>): T
  createService <T extends IContextService> (id: TServiceId<T>): T
}
