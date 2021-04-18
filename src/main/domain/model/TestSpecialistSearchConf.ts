import { SearchConfig } from '../../../lib/persistence/SearchConfig'

export class TestSpecialistSearchConf extends SearchConfig {
  public searchDeleted?: boolean = false

  public searchAlsoDeleted () {
    this.searchDeleted = true
    return this
  }

  public sortFirstName () {
    return this.addSort('firstName')
  }

  public sortFirstNameDesc () {
    return this.addSort('firstName', 'DESC')
  }
}
