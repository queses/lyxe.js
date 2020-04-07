import '../lib/core/register-luxe'
import { LuxeFramework } from '../lib/core/LuxeFramework'

const run = () => {
  LuxeFramework.requirePlugin('persistence-typeorm', 'event-local', 'crypto')
}