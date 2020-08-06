import { TransientService } from '../di/annotations/TransientService'
import { BaseContextService } from './BaseContextService'
import { TBaseContextInfo } from './luxie-context-info'

@TransientService()
export class ServiceFactory <C extends TBaseContextInfo = TBaseContextInfo> extends BaseContextService<C> {}
