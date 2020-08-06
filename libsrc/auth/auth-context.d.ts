import { TBaseContextInfo } from '../core/context/luxie-context-info'

export type TAuthContextInfo = TBaseContextInfo & { auth?: TContextAuth }

export type TContextAuth = {
  authId: number
  authorities: string[]
}
