export class StringUtil {
  static startsWithUpper (str: string) {
    return (str[0].toUpperCase() === str[0])
  }

  static startsWithNumber (str: string) {
    return !!str && !isNaN(Number(str[0]))
  }
}