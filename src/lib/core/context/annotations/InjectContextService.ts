/**
 * Creates and injects ContextService instance into current ContextService.
 * If the transferred service is an UseCase, then each call creates a new instance.
 * Otherwise, each non-first call returns instance, created on first call
 * @param id
 * @constructor
 */
import { IContextService } from '../IContextService'
import { TServiceId } from '../../di/lyxe-di'
import { IUseCase } from '../IUseCase'

export const InjectContextService = <S extends IContextService> (id: TServiceId<S>) => {
  return (target: IContextService, name: string) => {
    Object.defineProperty(target, name, {
      get (this: IContextService) {
        const value = this.createContextService(id)
        if (typeof (value as unknown as IUseCase).run !== 'function') {
          Object.defineProperty(this, name, { value })
        }

        return value
      },
      set () {}
    })
  }
}

