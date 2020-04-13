export class ServiceInitHandlersRegistry {
  private handlers: Array<() => void | Promise<void>> = []

  public static add (handler: () => void | Promise<void>) {
    this.inst.handlers.push(handler)
  }

  public static async callAll () {
    await Promise.all(this.inst.handlers.map(handler => handler()))
    delete this.inst.handlers
    this.inst.handlers = []
  }

  public static get inst (): ServiceInitHandlersRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
