import { SearchConfig } from 'lyxe/lib/persistence/SearchConfig'

export class TestSpecialistSearchConf extends SearchConfig {
  public onlyInactive?: boolean = false

  public searchOnlyInactive () {
    this.onlyInactive = true
    return this
  }

  public sortFirstName () {
    return this.addSort('firstName')
  }

  public sortFirstNameDesc () {
    return this.addSort('firstName', 'DESC')
  }
}
