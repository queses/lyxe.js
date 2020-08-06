import { TClass } from '../core/di/lyxe-di'
import { IConsoleController } from './IConsoleController'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'

const DELIMITER = ':'

export class ConsoleControllerRegistry {
  private addedControllers: Map<string, boolean> = new Map()
  private actionsMap: Map<string, { controllerClass: TClass<IConsoleController>, description: string, method: string }> = new Map()
  private rawActions: WeakMap<TClass<IConsoleController>, Array<{ path: string, description: string, method: string }>> = new WeakMap()

  public static get inst (): ConsoleControllerRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  public addAction (method: string, path: string, description: string, controllerClass: TClass<IConsoleController>) {
    const actions = this.rawActions.get(controllerClass)
    if (!actions) {
      this.rawActions.set(controllerClass, [ { path, description, method } ])
    } else {
      actions.push({ path, description, method })
    }
  }

  public addController (path: string, controllerClass: TClass<IConsoleController>) {
    if (this.addedControllers.has(path)) {
      throw new InvalidArgumentError(`Path ${path} was already defined`)
    }

    this.mapActionsForController(path, controllerClass)
    this.addedControllers.set(path, true)
  }

  public getAction (path: string) {
    return this.actionsMap.get(path)
  }

  private mapActionsForController (controllerPath: string, controllerClass: TClass<IConsoleController>) {
    const actions = this.rawActions.get(controllerClass)
    if (!actions) {
      return
    }

    for (const { method, description, path } of actions) {
      const fullPath = controllerPath + DELIMITER + path
      this.actionsMap.set(fullPath, { method, description, controllerClass })
    }

    this.rawActions.set(controllerClass, [])
  }
}
