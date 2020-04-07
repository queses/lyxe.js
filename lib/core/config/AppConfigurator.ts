import { AppConfigurationError } from '../application-errors/AppConfigurationError'
import { AppEnv } from './AppEnv'

export class AppConfigurator {
  private configProperties: Map<string, string | boolean | number> = new Map()

  private constructor () {
    this.initDefaultConfig()
  }

  public static importConfig (configStr: string) {
    this.inst.importConfig(configStr)
  }

  public static get <T extends string | number | boolean> (name: string): T {
    return this.inst.get<T>(name)
  }

  public static has (name: string) {
    return this.inst.configProperties.has(name)
  }

  public static set (name: string, value: string | number | boolean) {
    return this.inst.set(name, value)
  }

  private initDefaultConfig () {
    const dbType = this.getEnvString('DB_TYPE')
    if (dbType) {
      this
        .set('db.default.type', dbType)
        .setStrict('db.default.host', this.getEnvString('DB_HOST'))
        .setStrict('db.default.port', this.getEnvInt('DB_PORT'))
        .setStrict('db.default.database', this.getEnvString('DB_NAME'))
        .setStrict('db.default.username', this.getEnvString('DB_USER'))
        .setStrict('db.default.password', this.getEnvString('DB_PASS'))
        .setStrict('db.default.cache', this.getEnvBoolean('DB_CACHE'))

      if (AppEnv.inTest) {
        this
          .set('db.default.type', this.getEnvString('DB_TYPE_TEST'))
          .set('db.default.password', this.getEnvString('DB_PASS_TEST'))
          .set('db.default.username', this.getEnvString('DB_USER_TEST'))
          .set('db.default.database', this.getEnvString('DB_NAME_TEST'))
      }
    }

    const redisEnabled = this.getEnvBoolean('REDIS_ENABLED')
    this.set('redis.enabled', redisEnabled)
    if (redisEnabled) {
      this
        .setStrict('redis.port', this.getEnvInt('REDIS_PORT'))
        .setStrict('redis.host', this.getEnvString('REDIS_HOST') || 'localhost')
        .setStrict('redis.db', this.getEnvInt('REDIS_DB'))
        .setStrict('redis.prefixCache', this.getEnvString('REDIS_PREFIX_CACHE') || 'luxe-app-cache')
    }

    this
      .set('web.defaultPageSize', 15)
      .set('web.host', this.getEnvString('HOST'))
      .set('web.frontendHost', this.getEnvString('FRONTEND_HOST'))
      .set('web.mainHost', this.getEnvString('MAIN_HOST') || this.getEnvString('HOST'))
      .set('web.port', this.getEnvInt('PORT') || 3000)
      .set('web.logInfoToFile', this.getEnvBoolean('WEB_LOG_INFO_TO_FILE'))
      .set('web.cache', this.getEnvBoolean('HTTP_CACHE'))

    this
      .set('auth.authTokenDuration', 600) // 10 minutes
      .set('auth.refreshTokenDuration', 15_552_000) // 6 months
      .set('auth.refreshTokenCookie', 'lx-jwt-refresh')

    this
      .set('console.measureActionsTime', this.getEnvBoolean('MEASURE_ACTIONS_TIME'))
  }

  private get <T extends string | number | boolean> (name: string): T {
    if (!this.configProperties.has(name)) {
      throw new AppConfigurationError('Not found "' + name + '" property in app configuration')
    }

    return this.configProperties.get(name) as T
  }

  private importConfig (configStr: string) {
    configStr = configStr + '\n'
    let lineEndIndex: number
    let lineStartIndex: number = 0
    for (;;) {
      lineEndIndex = configStr.indexOf('\n', lineStartIndex)
      if (lineEndIndex < 0) {
        break
      }

      this.parseConfigStrLine(configStr.substring(lineStartIndex + 1, lineEndIndex))
      lineStartIndex = lineEndIndex + 1
    }
  }

  private parseConfigStrLine (line: string) {
    const eqIndex = line.indexOf('=')
    if (eqIndex < 0) {
      return
    }

    const name = line.substring(0, eqIndex).trim()
    const param = line.substring(eqIndex + 1).trim()
    if (!name || !param) {
      return
    }

    let value: string | number | boolean | undefined = param
    if (param.startsWith('@')) {
      value = this.getEnvString(param.substr(1))
    } else if (param.startsWith('string@')) {
      value = this.getEnvString(param.substr(7))
    } else if (param.startsWith('boolean@')) {
      value = this.getEnvBoolean(param.substr(8))
    } else if (param.startsWith('int@')) {
      value = this.getEnvInt(param.substr(4))
    } else if (param.startsWith('float@')) {
      value = this.getEnvFloat(param.substr(6))
    }

    this.set(name, value)
  }

  private set (name: string, value: string | boolean | number | undefined) {
    if (typeof value !== 'undefined') {
      this.configProperties.set(name, value)
    }

    return this
  }

  private setStrict (name: string, value: string | boolean | number | undefined) {
    if (typeof value === 'undefined') {
      throw new AppConfigurationError('Unable to set app configuration "' + name + '" param: value should not be undefined')
    }

    this.configProperties.set(name, value)
    return this
  }

  private getEnvBoolean (name: string): boolean | undefined {
    const variable = process.env[name]
    return (!!variable && variable !== '0' && variable !== 'false')
  }

  private getEnvInt (name: string): number | undefined {
    const variable = parseInt(process.env[name] as string, 10)
    return isNaN(variable) ? undefined : variable
  }

  private getEnvFloat (name: string): number | undefined {
    const variable = parseFloat(process.env[name] as string)
    return isNaN(variable) ? undefined : variable
  }

  private getEnvString (name: string): string | undefined {
    return process.env[name]
  }

  private static get inst (): AppConfigurator {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
