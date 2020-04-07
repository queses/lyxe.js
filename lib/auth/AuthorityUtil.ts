import { DomainAccessError } from '../core/domain-errors/DomainAccessError'
import { TContextAuth } from './auth-context'
import { AuthContextMeta } from './AuthContextMeta'

export class AuthorityUtil {
  public static checkAuth (auth: TContextAuth | undefined, authorities: Array<string | string[]>, errorMessage?: string) {
    if (!auth || !Array.isArray(auth.authorities) || !auth.authorities.length) {
      throw new DomainAccessError(errorMessage)
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

    if (hasAccess) {
      throw new DomainAccessError(errorMessage)
    }
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