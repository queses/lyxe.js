import { TServiceId } from '../../di/lyxe-di'
import { TransientService } from '../../di/annotations/TransientService'
import { IUseCase } from '../IUseCase'

export const UseCase = <T extends IUseCase> (id?: TServiceId<T>) => TransientService(id)
