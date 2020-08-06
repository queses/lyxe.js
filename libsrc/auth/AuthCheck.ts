import { IContextService } from '../core/context/IContextService'
import { TAuthContextInfo } from './auth-context'
import { AuthorityUtil } from './AuthorityUtil'
import { DomainAccessError } from '../core/domain-errors/DomainAccessError'

export class AuthCheck {
  private _message?: string

  constructor (private readonly srv: IContextService) {}

  public static of (srv: IContextService) {
    return new this(srv)
  }

  public static isSystem (srv: IContextService) {
    return (srv.contextInfo && !srv.contextInfo.asSystem) || false
  }

  public message (message: string) {
    this._message = message
    return this
  }

  public systemOnly () {
    if (!this.srv.contextInfo || !this.srv.contextInfo.asSystem) {
      throw new DomainAccessError(this._message)
    }
  }

  public has (...authorities: Array<string | string[]>) {
    if (this.srv.contextInfo && this.srv.contextInfo.asSystem) {
      return
    } else {
      const auth = this.srv.contextInfo ? (this.srv.contextInfo as TAuthContextInfo).auth : undefined
      AuthorityUtil.checkAuth(auth, authorities, this._message)
    }
  }

  public hasStrict (...authorities: Array<string | string[]>) {
    const auth = this.srv.contextInfo ? (this.srv.contextInfo as TAuthContextInfo).auth : undefined
    AuthorityUtil.checkAuth(auth, authorities, this._message)
  }
}
