import { TBaseContextInfo } from '../core/context/lyxe-context-info'

export type TAuthContextInfo = TBaseContextInfo & { auth?: TContextAuth }

export type TContextAuth = {
  authId: number
  authorities: string[]
}
