import { TAnyRequest, TAnyResponse, TCookieOptions } from './luxe-web'

export interface IWebFacade <RQ extends TAnyRequest = TAnyRequest, RS extends TAnyResponse = TAnyResponse> {
  extractIp (req: RQ): string
  getHeader (name: string, req: RQ): string | undefined
  setHeader (name: string, value: string, res: RS): void
  getCookie (name: string, req: RQ): string | undefined
  setCookie (name: string, value: string, options: TCookieOptions, res: RS): void
  removeCookie (name: string, options: TCookieOptions, res: RS): void
}
