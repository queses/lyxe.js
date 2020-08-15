import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('web-express')
  require('./NestLogger')
}
