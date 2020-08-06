import { LuxieFramework } from '../core/LuxieFramework'

export default () => {
  LuxieFramework.requirePlugins('event')
  require('./LocalDomainEventBus')
}
