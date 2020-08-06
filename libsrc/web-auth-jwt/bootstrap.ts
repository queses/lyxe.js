import { LuxieFramework } from '../core/LuxieFramework'

export default () => {
  LuxieFramework.requirePlugins('web', 'auth', 'crypto')

  require('./jwt/JwtService')
}
