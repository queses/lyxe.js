import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugin('event')
  require('../event/LocalDomainEventBus')
}
