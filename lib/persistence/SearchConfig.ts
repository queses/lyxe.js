import { TSortOrder } from './luxe-persistence'
import { PageConfig } from './PageConfig'

export class SearchConfig {
  public page?: PageConfig
  public sortOptions: { [key: string]: TSortOrder } = {}
  public sortRelations: { [key: string]: string } = {}

  constructor (page?: PageConfig) {
    this.page = page
  }

  protected addSort (attr: string, order: TSortOrder = 'ASC', asRelation: boolean = false) {
    this.sortOptions[attr] = order
    if (asRelation) {
      this.sortRelations[attr] = attr.split('.').shift() as string
    }
  }
}
