import Token from './Token'

export type TServiceId<T> = Token<T> | string | symbol | TClass<T>

export type TClass<T> = {
  new (...args: any[]): T
  name: string
}

export type TNoNewClass<T> = {
  new? (...args: any[]): T
  name: string
}


export type TFactoryFunc<T, A = any> = (...args: A[]) => T
