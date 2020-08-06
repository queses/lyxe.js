import { TBaseContextInfo } from './luxie-context-info'
import { IUseCase } from './IUseCase'
import { BaseContextService } from './BaseContextService'
import { AbstractService } from '../di/annotations/AbstractService'

@AbstractService()
export abstract class BaseUseCase <C extends TBaseContextInfo = TBaseContextInfo, A = any, R = any>
  extends BaseContextService<C> implements IUseCase<C, A, R>
{
  abstract run (...args: A[]): R
}
