export class CookieUtil {
  public static parse (name: string, cookieString: string): string | undefined {
    if (!cookieString) {
      return
    } else if (cookieString.startsWith(name + '=')) {
      const endIndex = cookieString.indexOf(';')
      return cookieString.substring(1 + name.length, (endIndex >= 0) ? endIndex : undefined)
    }

    let search = '; ' + name + '='
    let index = cookieString.indexOf(search)
    if (index < 0) {
      search = ';' + name + '='
      index = cookieString.indexOf(search)
      if (index < 0) {
        return
      }
    }

    const endIndex = cookieString.indexOf(';', index + 1)
    return cookieString.substring(index + search.length, (endIndex >= 0) ? endIndex : undefined)
  }
}