import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('event')
  require('./LocalDomainEventBus')
}
