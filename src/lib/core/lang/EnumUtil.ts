import { StringUtil } from './StringUtil'

export class EnumUtil {
  static getEnumValues <T extends Record<string, unknown>> (enumType: T): Array<T[keyof T]> {
    const keys = Object.keys(enumType)
    const result: Array<T[keyof T]> = []
    for (const key of keys) {
      if (!StringUtil.startsWithNumber(key)) {
        result.push(enumType[key as keyof T])
      }
    }

    return result
  }

  static isInEnum = <T extends Record<string, unknown>> (value: string | number, enumType: T): boolean => {
    const keys = Object.keys(enumType)
    for (const key of keys) {
      if (!StringUtil.startsWithNumber(key) && enumType[key as keyof T] === value as any) {
        return true
      }
    }

    return false
  }
}