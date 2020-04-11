import { TBaseContextInfo } from './luxe-context-info'
import { IContextService} from './IContextService'
import { IUseCase } from './IUseCase'
import Token from '../di/Token'
import { IReadService } from './IReadService'
import { AbstractService } from '../di/annotations/AbstractService'
import { TClass, TServiceId } from '../di/luxe-di'
import { AppContainer } from '../di/AppContainer'
import { IServiceFactory } from './IServiceFactory'

@AbstractService()
export abstract class BaseContextService <C extends TBaseContextInfo = TBaseContextInfo>
  implements IContextService<C>, IServiceFactory<C>
{
  private _contextInfo?: C

  public configure (context: C | undefined): this {
    this._contextInfo = context
    return this
  }

  public get contextInfo () {
    return this._contextInfo
  }

  public createUseCase <T extends IUseCase<C>>(id: Token<T> | string | symbol | TClass<T>): T {
    return this.createService<T>(id)
  }

  public createReadService <T extends IReadService<C>>(id: Token<T> | string | symbol | TClass<T>): T {
    return this.createService<T>(id)
  }

  public createService <T extends IContextService<C>> (id: TServiceId<T>): T {
    return AppContainer.get(id).configure(this.contextInfo)
  }
}