import { BaseContextService } from './BaseContextService'
import { TBaseContextInfo } from './lyxe-context-info'
import { ContextService } from './annotations/ContextService'

@ContextService()
export class ServiceFactory <C extends TBaseContextInfo = TBaseContextInfo> extends BaseContextService<C> {}
