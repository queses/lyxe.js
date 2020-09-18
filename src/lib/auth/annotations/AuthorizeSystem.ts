import { IContextService } from '../../core/context/IContextService'
import { AppError } from '../../core/application-errors/AppError'
import { TAuthContextInfo } from '../auth-context'
import { AuthorityUtil } from '../AuthorityUtil'

export const AuthorizeSystem = <S extends IContextService<C>, C extends TAuthContextInfo> (
  authorities: Array<string | string[]>, message?: string
) => (target: S, name: string, descriptor: PropertyDescriptor) => {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new AppError(`Class member ${name} annotated with "@AuthorizeSystem" should be a function`)
  } else if (!authorities || !authorities.length) {
    return
  }

  const method: (...args: any) => any = descriptor.value
  Reflect.set(target, name, function <A = any> (this: S, ...args: A[]) {
    if (this.contextInfo && this.contextInfo.asSystem) {
      return
    }

    const auth = this.contextInfo ? (this.contextInfo as TAuthContextInfo).auth : undefined
    AuthorityUtil.checkAuth(auth, authorities, message)

    return Reflect.apply(method, this, args)
  })
}
