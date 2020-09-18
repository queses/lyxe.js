export class ClassUtil {
  static cacheProperty = <T, C extends { [key in string]: any }> (
    c: C,
    key: string,
    valueFactory: () => T
  ): T => {
    const cacheKey = '_property-cache_' + key
    if (c.hasOwnProperty(cacheKey)) {
      return Reflect.get(c, cacheKey) as T
    } else {
      const value: T = valueFactory.call(c)
      Reflect.set(c, cacheKey, value)
      return value
    }
  }
}
