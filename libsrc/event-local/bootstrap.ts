import { LyxeFramework } from '../core/LuxieFramework'

export default () => {
  LyxeFramework.requirePlugins('event')
  require('./LocalDomainEventBus')
}
