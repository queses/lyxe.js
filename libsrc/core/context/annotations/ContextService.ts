import { TServiceId } from '../../di/lyxe-di'
import { IContextService } from '../IContextService'
import { TransientService } from '../../di/annotations/TransientService'

export const ContextService = <T extends IContextService> (id?: TServiceId<T>) => TransientService(id)
