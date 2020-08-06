export type TAnyRequest = any

export type TAnyResponse = any

export type TCookieOptions = {
  expires?: Date
  httpOnly?: boolean
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: boolean | 'lax' | 'strict' | 'none'
}
