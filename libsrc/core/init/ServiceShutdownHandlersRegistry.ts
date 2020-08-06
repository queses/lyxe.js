import { AppShutdownPhase } from '../di/AppShutdownPhase'

export class ServiceShutdownHandlersRegistry {
  private handlersMap: Map<AppShutdownPhase, Array<() => void | Promise<void>>> = new Map()

  public static add (handler: () => void | Promise<void>, phase: AppShutdownPhase) {
    const handlers = this.inst.handlersMap.get(phase)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.inst.handlersMap.set(phase, [ handler ])
    }
  }

  public static hasHandlers () {
    for (const handlers of this.inst.handlersMap.values()) {
      if (handlers.length > 0) {
        return true
      }
    }

    return false
  }

  public static async callAll () {
    await this.inst.callPhaseHandlers(AppShutdownPhase.INITIAL)
    await this.inst.callPhaseHandlers(AppShutdownPhase.DEFAULT)
    await this.inst.callPhaseHandlers(AppShutdownPhase.LAST)
  }

  public static get inst (): ServiceShutdownHandlersRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  public async callPhaseHandlers (phase: AppShutdownPhase) {
    const handlers = this.handlersMap.get(phase)
    if (handlers) {
      await Promise.all(handlers.map(handler => handler()))
      this.handlersMap.delete(phase)
    }
  }
}
