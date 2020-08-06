import { LyxeFramework } from '../core/LuxieFramework'

export default () => {
  LyxeFramework.requirePlugins('web', 'auth', 'crypto')

  require('./jwt/JwtService')
}
