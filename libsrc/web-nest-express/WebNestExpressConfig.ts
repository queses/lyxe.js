export class WebNestExpressConfig {
  public useStaticDirectory: boolean = true
  public useCors: boolean = true

  public static useStaticDirectory (value: boolean) {
    this.inst.useStaticDirectory = value
    return this
  }

  public static useCors (value: boolean) {
    this.inst.useCors = value
    return this
  }

  public static get inst (): WebNestExpressConfig {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}