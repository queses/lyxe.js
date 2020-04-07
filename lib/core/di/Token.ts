import { TClass } from './luxe-di'

export default class Token<T> {
  name: string
  prototype: TClass<T> | undefined

  constructor (prototypeOrName?: TClass<T> | string) {
    if (!prototypeOrName) {
      this.name = 'UnnamedToken'
    } else if (typeof prototypeOrName === 'function') {
      this.name = prototypeOrName.name
      this.prototype = prototypeOrName
    } else {
      this.name = prototypeOrName
    }
  }

  toString () {
    return this.name
  }
}
