import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'

export class NestCorsUtil {
  public static getOriginWithSubdomains (url: string) {
    let protocol = ''
    let host = ''
    if (url.startsWith('https://')) {
      host = url.substr(8)
      protocol = 'https://'
    } else if (url.startsWith('http://')) {
      host = url.substr(7)
      protocol = 'http://'
    } else {
      throw new InvalidArgumentError('Wrong URL passed to Nest CORS origin generator')
    }

    // return new RegExp(`^${protocol}(.+\\.)?${host}$`)
    return function (origin: string, resolve: (err: Error | undefined, allow: boolean) => void) {
      resolve(undefined, (origin)
        ? (origin === url || (origin.startsWith(protocol) && origin.endsWith('.' + host)))
        : false
      )
    }
  }
}
