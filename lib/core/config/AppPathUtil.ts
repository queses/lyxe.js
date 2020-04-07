import * as path from 'path'

export class AppPathUtil {
  static get appSrcRelative () {
    return './src'
  }

  static get appSrc () {
    return this.absolutePathOf(this.appSrcRelative)
  }

  static get appLib () {
    return this.absolutePathOf('./lib')
  }

  static get appData () {
    return this.absolutePathOf('data', true)
  }

  static get appLogs () {
    return this.appData + '/logs'
  }

  static get codeExtWildcard () {
    return '\.js'
  }

  private static absolutePathOf (pathToAppend: string = '', asAssetsDir: boolean = false) {
    const appRootPath = asAssetsDir ? '../../../../..' : '../../../..'
    return path.join(__dirname, appRootPath, pathToAppend)
  }
}