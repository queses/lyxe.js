import { TAppLaunchType } from './lyxe-config'

export class AppEnv {
  private static contextType: TAppLaunchType

  public static get inProduction () {
    return (process.env.NODE_ENV === 'production')
  }

  public static get inDevelopment () {
    return (process.env.NODE_ENV !== 'production')
  }

  public static get inTest () {
    return (process.env.NODE_ENV === 'test')
  }

  public static get asWeb () {
    return this.contextType === 'web'
  }

  public static get asConsole () {
    return this.contextType === 'console'
  }

  public static setLaunchType (type: TAppLaunchType) {
    this.contextType = type
  }
}
