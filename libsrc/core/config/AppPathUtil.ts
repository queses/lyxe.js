import * as path from 'path'
import * as glob from 'glob'
import { StringUtil } from '../lang/StringUtil'
import { Cached } from '../lang/annotations/Cached'

export class AppPathUtil {
  @Cached()
  static get appSrcRelative () {
    return './src'
  }

  @Cached()
  static get appSrc () {
    return this.absolutePathOf(this.appSrcRelative)
  }

  @Cached()
  static get appLib () {
    return this.absolutePathOf('./lib')
  }

  @Cached()
  static get appData () {
    return this.absolutePathOf('data', true)
  }

  @Cached()
  static get appLogs () {
    return this.appData + '/logs'
  }

  static get codeExtWildcard () {
    return '\.js'
  }

  static globClasses (cwd: string, dirWildcard = '**'): Promise<string[]> {
    return new Promise((res, rej) => {
      glob(`${dirWildcard}/*${this.codeExtWildcard}`, { cwd }, (err, matches) => (err)
        ? rej(err)
        : res(matches.filter((path) => (
          !path.endsWith('.spec.js') &&
          !path.endsWith('.test.js') &&
          !path.endsWith('.external.js') &&
          StringUtil.startsWithUpper(path.substr(path.lastIndexOf('/') + 1)))
        ))
      )
    })
  }

  private static absolutePathOf (pathToAppend: string = '', asAssetsDir: boolean = false) {
    return asAssetsDir ? path.join(process.cwd(), pathToAppend) : path.join(process.cwd(), 'dist', pathToAppend)
  }
}