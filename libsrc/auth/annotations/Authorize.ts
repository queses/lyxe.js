import { IContextService } from '../../core/context/IContextService'
import { AppError } from '../../core/application-errors/AppError'
import { TAuthContextInfo, TContextAuth } from '../auth-context'
import { AuthorityUtil } from '../AuthorityUtil'

export const Authorize = <S extends IContextService<C>, C extends TAuthContextInfo> (
  authorities: Array<string | string[]>, message?: string
) => (target: S, name: string, descriptor: PropertyDescriptor) => {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new AppError(`Class member ${name} annotated with "@Authorize" should be a function`)
  } else if (!authorities || !authorities.length) {
    return
  }

  const method: Function = descriptor.value
  Reflect.set(target, name, function <A = any> (this: S, ...args: A[]) {
    const auth: TContextAuth | undefined = this.contextInfo ? this.contextInfo.auth : undefined
    AuthorityUtil.checkAuth(auth, authorities, message)
    return Reflect.apply(method, this, args)
  })
}
