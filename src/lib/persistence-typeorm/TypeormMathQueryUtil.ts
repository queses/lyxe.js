import { SelectQueryBuilder } from 'typeorm'

export class TypeormMathQueryUtil {
  static where <T> (q: SelectQueryBuilder<T>, key: string, query: string, cols: string[]) {
    return q.where(
      `MATCH (${cols.join(',')}) AGAINST (:${key} IN BOOLEAN MODE)`,
      { [key]: this.prepareFulltext(query) }
    )
  }

  static andWhere <T> (q: SelectQueryBuilder<T>, key: string, query: string, cols: string[]) {
    return q.andWhere(
      `MATCH (${cols.join(',')}) AGAINST (:${key} IN BOOLEAN MODE)`,
      { [key]: this.prepareFulltext(query) }
    )
  }

  static orWhere <T> (q: SelectQueryBuilder<T>, key: string, query: string, cols: string[]) {
    return q.orWhere(
      `MATCH (${cols.join(',')}) AGAINST (:${key} IN BOOLEAN MODE)`,
      { [key]: this.prepareFulltext(query) }
    )
  }

  private static prepareFulltext (query: string) {
    return query.replace(/["<>()]/g, '').replace(/[-@+~*]/, ' ') + '*'
  }
}
