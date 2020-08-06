import { TObjectLiteral } from '../../core/lang/luxie-lang'

export class AbstractHttpError extends Error {
  name = 'AbstractHttpError'

  public readonly status: number
  private readonly extraPayload: TObjectLiteral

  constructor (status: number, message: string, extraPayload: TObjectLiteral = {}) {
    super(message)
    this.status = status
    this.message = message
    this.extraPayload = extraPayload
  }

  public getErrorBody () {
    return Object.assign(this.extraPayload, { status: this.status, message: this.message })
  }
}
