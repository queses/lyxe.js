import { TransientService } from '../di/annotations/TransientService'
import { BaseContextService } from './BaseContextService'
import { TBaseContextInfo } from './lyxe-context-info'

@TransientService()
export class ServiceFactory <C extends TBaseContextInfo = TBaseContextInfo> extends BaseContextService<C> {}
