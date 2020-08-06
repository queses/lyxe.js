import { TServiceId } from '../../di/luxie-di'
import { TransientService } from '../../di/annotations/TransientService'
import { IUseCase } from '../IUseCase'

export const UseCase = <T extends IUseCase> (id?: TServiceId<T>) => TransientService(id)
