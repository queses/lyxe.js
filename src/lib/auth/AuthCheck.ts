import { IContextService } from '../core/context/IContextService'
import { TAuthContextInfo } from './auth-context'
import { AuthorityUtil } from './AuthorityUtil'
import { DomainAccessError } from '../core/domain-errors/DomainAccessError'

export class AuthCheck {
  private errorMessage?: string

  constructor (private readonly srv: IContextService) {}

  public static of (srv: IContextService) {
    return new this(srv)
  }

  public static doesHave (
    srvOrCtx: IContextService<TAuthContextInfo> | TAuthContextInfo | undefined,
    ...authorities: Array<string | string[]>
  ) {
    const ctx = srvOrCtx && typeof (srvOrCtx as IContextService).createService === 'function'
      ? (srvOrCtx as IContextService<TAuthContextInfo>).contextInfo
      : (srvOrCtx as TAuthContextInfo | undefined)

    return (ctx && ctx.asSystem) ? true : AuthorityUtil.hasAuthorities(ctx?.auth, authorities)
  }

  public static doesHaveStrict (
    srvOrCtx: IContextService<TAuthContextInfo> | TAuthContextInfo | undefined,
    ...authorities: Array<string | string[]>
  ) {
    const ctx = srvOrCtx && typeof (srvOrCtx as IContextService).createService === 'function'
      ? (srvOrCtx as IContextService<TAuthContextInfo>).contextInfo
      : (srvOrCtx as TAuthContextInfo | undefined)

    return AuthorityUtil.hasAuthorities(ctx?.auth, authorities)
  }

  public message (message: string) {
    this.errorMessage = message
    return this
  }

  public systemOnly () {
    if (!this.srv.contextInfo || !this.srv.contextInfo.asSystem) {
      throw new DomainAccessError(this.errorMessage)
    }
  }

  public has (...authorities: Array<string | string[]>) {
    if (this.srv.contextInfo && this.srv.contextInfo.asSystem) {
      return
    } else {
      const auth = this.srv.contextInfo ? (this.srv.contextInfo as TAuthContextInfo).auth : undefined
      if (!AuthorityUtil.hasAuthorities(auth, authorities)) {
        throw new DomainAccessError(this.errorMessage)
      }
    }
  }

  public hasStrict (...authorities: Array<string | string[]>) {
    const auth = this.srv.contextInfo ? (this.srv.contextInfo as TAuthContextInfo).auth : undefined
    if (!AuthorityUtil.hasAuthorities(auth, authorities)) {
      throw new DomainAccessError(this.errorMessage)
    }
  }
}
