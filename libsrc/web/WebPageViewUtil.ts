import { Page } from '../persistence/Page'
import { IHasId } from '../persistence/IHasId'
import { TPersistenceId } from '../persistence/lyxe-persistence'

export class WebPageViewUtil {
  static async forObjects <V> (
    items: V[], current: number = 1, size: number = 0, elements?: number
  ) {
    elements = (typeof elements === 'number') ? elements : items.length
    const pages = (size === 0 || items.length === 0) ? 0 : Math.ceil(elements / size)

    return {
      items,
      page: { size, current, elements, pages }
    }
  }

  static forEntities <V, E extends IHasId<ID>, ID extends TPersistenceId> (
    page: Page<E>, items: V[]
  ) {
    return {
      items,
      page: {
        size: page.pageSize,
        current: page.currentPage,
        elements: page.totalElements,
        pages: page.totalPages
      }
    }
  }

  static async empty () {
    return this.forObjects([])
  }
}
