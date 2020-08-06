import { AppConfigurationError } from './application-errors/AppConfigurationError'
import { ServiceInitHandlersRegistry } from './init/ServiceInitHandlersRegistry'
import { ServiceShutdownHandlersRegistry } from './init/ServiceShutdownHandlersRegistry'
import { AppPathUtil } from './config/AppPathUtil'

export class LuxieFramework {
  private bootstrappedPlugins: Map<string, boolean> = new Map()
  private bootstrappedModules: Map<string, boolean> = new Map()

  public static requirePlugins (...pluginNames: string[]) {
    for (const pluginName of pluginNames) {
      if (!this.inst.bootstrappedPlugins.has(pluginName)) {
        this.inst.requirePluginBootstrap(pluginName)()
        this.inst.bootstrappedPlugins.set(pluginName, true)
      }
    }

    return this
  }

  public static requireModules (...moduleNames: string[]) {
    for (const moduleName of moduleNames) {
      if (!this.inst.bootstrappedModules.has(moduleName)) {
        this.inst.requireModuleBootstrap(moduleName)
        this.inst.bootstrappedModules.set(moduleName, true)
      }
    }

    return this
  }

  public static run () {
    if (this.inst.bootstrappedModules.size === 0) {
      throw new AppConfigurationError('App bootstrap error: should be required at least one app module')
    }

    this.inst.shutdownOnExit()
    return ServiceInitHandlersRegistry.callAll()
  }

  public static shutdown () {
    return this.inst.onExit()
  }

  public static hasPlugin (name: string) {
    return this.inst.bootstrappedPlugins.has(name)
  }

  private shutdownOnExit () {
    process.on('SIGINT', () => this.onExit().then(() => process.exit()))
  }

  private async onExit () {
    if (ServiceShutdownHandlersRegistry.hasHandlers()) {
      return ServiceShutdownHandlersRegistry.callAll()
    }
  }

  private requireModuleBootstrap (moduleName: string) {
    try {
      require(`${AppPathUtil.appSrc}/${moduleName}/register`)
    } catch (e) {
      throw new AppConfigurationError(`App bootstrap error: module "${moduleName}" not found`)
    }
  }

  private requirePluginBootstrap (pluginName: string) {
    let bootstrapPlugin: (() => void) | undefined
    try {
      bootstrapPlugin = require(`../${pluginName}/bootstrap`).default
    } catch (e) {
      // No plugin in default package found
    }

    if (bootstrapPlugin) {
      return bootstrapPlugin
    }

    try {
      bootstrapPlugin = require(`${AppPathUtil.appLib}/${pluginName}/bootstrap`).default
    } catch (e) {
      // No plugin in "lib" folder found
    }

    if (bootstrapPlugin) {
      return bootstrapPlugin
    }

    try {
      bootstrapPlugin = require(`luxie-plugin-${pluginName}/bootstrap`).default
    } catch (e) {
      // No plugin in `node_modules` found
    }

    if (!bootstrapPlugin) {
      throw new AppConfigurationError(`Framework bootstrap error: plugin "${pluginName}" not found`)
    }

    return bootstrapPlugin
  }

  public static get inst (): LuxieFramework {
    // Register framework and bootstrap core module when first time accessed to framework
    require('./bootstrap').default()

    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }
}
