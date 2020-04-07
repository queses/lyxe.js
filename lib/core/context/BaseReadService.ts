import { BaseContextService } from './BaseContextService'
import { TBaseContextInfo } from './luxe-context-info'
import { AbstractService } from '../di/annotations/AbstractService'

@AbstractService()
export abstract class BaseReadService <C extends TBaseContextInfo = TBaseContextInfo> extends BaseContextService<C> {
  public configure (context: C | undefined): this {
    return super.configure((context) ? Object.assign(context, { inReadContext: true }) : undefined)
  }
}
