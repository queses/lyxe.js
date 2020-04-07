import { TBaseContextInfo } from '../core/context/luxe-context-info'

export type TAuthContextInfo = TBaseContextInfo & { auth?: TContextAuth }

export type TContextAuth = {
  authId: number
  authorities: string[]
}
