import { TClass } from '../../di/luxe-di'

export const Conditional = <A extends Function, T> (condition: () => boolean, annotation: A) => {
  return (target: TClass<T>) => {
    if (condition()) {
      return annotation(target)
    } else {
      return target
    }
  }
}
