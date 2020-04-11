import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('event')
  require('./LocalDomainEventBus')
}
