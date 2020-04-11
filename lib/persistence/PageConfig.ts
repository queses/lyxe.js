import { AppConfigurator } from '../core/config/AppConfigurator'

export class PageConfig {
  size: number
  current: number

  public constructor (size: number | string, current: number | string = 1) {
    this.size = ((typeof size === 'string') ? parseInt(size, 10) || 0 : size) || 0
    this.current = ((typeof current === 'string') ? parseInt(current, 10) : current) || 1
  }

  static ofDefaultSize (current: number = 1) {
    return new this(AppConfigurator.get('conf.web.defaultPageSize'), current)
  }

  static ofChunkSize (current: number = 1) {
    return new this(200, current)
  }

  public get skip () {
    return this.size * (this.current - 1)
  }

  public nextPage () {
    this.current++
    return this
  }
}
