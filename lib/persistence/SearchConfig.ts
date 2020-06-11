import { TSortOrder } from './luxe-persistence'
import { PageConfig } from './PageConfig'

export class SearchConfig {
  public page?: PageConfig
  public sortOptions: { [key: string]: TSortOrder } = {}
  public sortRelations: { [key: string]: string } = {}

  constructor (page?: PageConfig) {
    this.page = page
  }

  public clearSort () {
    this.sortOptions = {}
    this.sortRelations = {}
  }

  protected addSort (attr: string, order: TSortOrder = 'ASC') {
    this.sortOptions[attr] = order
    return this
  }

  protected addRelationSort (relation: string, attr: string, order: TSortOrder = 'ASC') {
    const relationAttr = `${relation}.${attr}`
    this.sortOptions[relationAttr] = order
    this.sortRelations[relationAttr] = relation

    return this
  }
}
