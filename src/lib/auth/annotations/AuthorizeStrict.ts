import { IContextService } from '../../core/context/IContextService'
import { AppError } from '../../core/application-errors/AppError'
import { TAuthContextInfo, TContextAuth } from '../auth-context'
import { AuthorityUtil } from '../AuthorityUtil'

export const AuthorizeStrict = <S extends IContextService<C>, C extends TAuthContextInfo> (
  authorities: Array<string | string[]>, errorMessage?: string
) => (target: S, name: string, descriptor: PropertyDescriptor) => {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new AppError(`Class member ${name} annotated with "@AuthorizeStrict" should be a function`)
  } else if (!authorities || !authorities.length) {
    return
  }

  const method: (...args: any) => any = descriptor.value
  Reflect.set(target, name, function <A = any> (this: S, ...args: A[]) {
    const auth: TContextAuth | undefined = this.contextInfo ? this.contextInfo.auth : undefined
    AuthorityUtil.checkAuthorities(auth, authorities, errorMessage)
    return Reflect.apply(method, this, args)
  })
}
