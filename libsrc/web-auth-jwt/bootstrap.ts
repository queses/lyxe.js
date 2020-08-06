import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('web', 'auth', 'crypto')

  require('./jwt/JwtService')
}
