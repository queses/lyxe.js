import { LuxeFramework } from '../core/LuxeFramework'

export default () => {
  LuxeFramework.requirePlugin('web', 'auth', 'crypto')
1
  require('./jwt/JwtService')
}
