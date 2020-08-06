export class EntityValidationErrorInfo {
  constructor (
    public path: string,
    public message: string
  ) {}

  static concatMessages (infos: EntityValidationErrorInfo | EntityValidationErrorInfo[]) {
    return (Array.isArray(infos) ? infos : [ infos ]).reduce((acc, val) => acc + val.message + '; ', '')
  }
}
