import { LyxeFramework } from '../core/LyxeFramework'

export default () => {
  LyxeFramework.requirePlugins('mutex')
  require('./cache-manager/CacheManagerAppCache')
  require('./fs/FsAppFileCache')
}

