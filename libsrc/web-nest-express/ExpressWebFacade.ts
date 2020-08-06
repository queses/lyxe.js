import { IWebFacade } from '../web/IWebFacade'
import { Request, Response } from 'express'
import { TCookieOptions } from '../web/lyxe-web'
import { CookieUtil } from '../web/CookieUtil'
import { SingletonService } from '../core/di/annotations/SingletonService'
import { WebFacadeTkn } from '../web/lyxe-web-tokens'

@SingletonService(WebFacadeTkn)
export class ExpressWebFacade implements IWebFacade<Request, Response> {
  extractIp (req: Request): string {
    // https://github.com/pbojinov/request-ip could be used as more secure alternative
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress || ''
    const commaIndex = ip.indexOf(',')

    return (commaIndex >= 0) ? ip.substring(0, commaIndex) : ip
  }

  getHeader (name: string, req: Request): string | undefined {
    return req.header(name) as string
  }

  setHeader (name: string, value: string, res: Response): void {
    res.header(name, value)
  }

  getCookie (name: string, req: Request): string | undefined {
    const cookie = req.header('cookie')
    return (cookie) ? CookieUtil.parse(name, cookie) : undefined
  }

  setCookie (name: string, value: string, options: TCookieOptions, res: Response): void {
    res.cookie(name, value, options)
  }

  removeCookie (name: string, options: TCookieOptions, res: Response): void {
    res.cookie(name, '', Object.assign({ expires: new Date(0) }, options))
  }
}
