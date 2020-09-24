import { TContextAuth } from './auth-context'
import { AuthContextMeta } from './AuthContextMeta'
import { DomainAccessError } from '../core/domain-errors/DomainAccessError'

export class AuthorityUtil {
  public static checkAuthorities (
    auth: TContextAuth | undefined,
    authorities: Array<string | string[]>,
    errorMessage?: string
  ) {
    if (!this.hasAuthorities(auth, authorities)) {
      throw new DomainAccessError(errorMessage)
    }
  }

  public static hasAuthorities (auth: TContextAuth | undefined, authorities: Array<string | string[]>): boolean {
    if (!auth || !Array.isArray(auth.authorities) || !auth.authorities.length) {
      return false
    }

    let ctxAuthorities: Set<string> = Reflect.getMetadata(AuthContextMeta.AUTH_AUTHORITIES_SET, auth)
    if (!ctxAuthorities) {
      ctxAuthorities = new Set(auth.authorities)
      Reflect.defineMetadata(AuthContextMeta.AUTH_AUTHORITIES_SET, ctxAuthorities, auth)
    }

    let i = 0
    let hasAccess = false
    while (!hasAccess && i < authorities.length) {
      const item = authorities[i++]
      hasAccess = Array.isArray(item) ? this.hasAll(item, ctxAuthorities) : ctxAuthorities.has(item)
    }

    return hasAccess
  }

  private static hasAll (authorities: string[], inSet: Set<string>) {
    for (const authority of authorities) {
      if (!inSet.has(authority)) {
        return false
      }
    }

    return true
  }
}
