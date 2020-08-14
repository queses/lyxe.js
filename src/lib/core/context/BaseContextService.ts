import { TBaseContextInfo } from './lyxe-context-info'
import { IContextService} from './IContextService'
import { AbstractService } from '../di/annotations/AbstractService'
import { TServiceId } from '../di/lyxe-di'
import { AppContainer } from '../di/AppContainer'

@AbstractService()
export abstract class BaseContextService <C extends TBaseContextInfo = TBaseContextInfo> implements IContextService<C> {
  private _contextInfo?: C

  public configure (context: C | undefined): this {
    this._contextInfo = context
    return this
  }

  public get contextInfo () {
    return this._contextInfo
  }

  public createService <T extends IContextService> (id: TServiceId<T>): T {
    return this.createContextService(id)
  }

  public createContextService <T extends IContextService> (id: TServiceId<T>): T {
    return AppContainer.get(id).configure(this.contextInfo)
  }
}
