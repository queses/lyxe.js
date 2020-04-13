import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('web', 'auth', 'crypto')

  require('./jwt/JwtService')
}
