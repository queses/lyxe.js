export class Page<T> extends Array<T> {
  private _currentPage: number
  private _pageSize: number
  private _totalPages: number
  private _totalElements: number

  public configurePage (current: number, size: number, count: number) {
    this._currentPage = current
    this._pageSize = size
    this._totalElements = count
    this._totalPages = (count) ? Math.ceil(count / size) : 0

    return this
  }

  public get currentPage () {
    return (this._currentPage < this._totalPages) ? this._currentPage : this._totalPages
  }

  public get pageSize () { return this._pageSize }
  public get totalPages () { return this._totalPages }
  public get totalElements () { return this._totalElements }
}
