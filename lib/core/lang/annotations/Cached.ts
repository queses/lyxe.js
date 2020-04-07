import { AppError } from '../../application-errors/AppError'

export const Cached = <C> () => (target: C, name: string, descriptor: PropertyDescriptor) => {
  const getter = descriptor && descriptor.get
  if (typeof getter !== 'function') {
    throw new AppError(`"${name}" is not a getter; looks like you're trying to cache property "${name}"`)
  }

  descriptor.get = function () {
    const value = getter.call(this)
    Object.defineProperty(this, name, { value })
    return value
  }
}
