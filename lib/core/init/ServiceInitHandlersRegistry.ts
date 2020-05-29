import { AppInitPhase } from '../di/AppInitPhase'

export class ServiceInitHandlersRegistry {
  private handlersMap: Map<AppInitPhase, Array<() => void | Promise<void>>> = new Map()

  public static add (handler: () => void | Promise<void>, phase: AppInitPhase) {
    const handlers = this.inst.handlersMap.get(phase)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.inst.handlersMap.set(phase, [ handler ])
    }
  }

  public static async callAll () {
    await this.inst.callPhaseHandlers(AppInitPhase.INITIAL)
    await this.inst.callPhaseHandlers(AppInitPhase.DEFAULT)
    await this.inst.callPhaseHandlers(AppInitPhase.LAST)
  }

  public static get inst (): ServiceInitHandlersRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  public async callPhaseHandlers (phase: AppInitPhase) {
    const handlers = this.handlersMap.get(phase)
    if (handlers) {
      await Promise.all(handlers.map(handler => handler()))
      this.handlersMap.delete(phase)
    }
  }
}
