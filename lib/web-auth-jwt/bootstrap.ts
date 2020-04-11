import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugins('web', 'auth', 'crypto')
1
  require('./jwt/JwtService')
}
