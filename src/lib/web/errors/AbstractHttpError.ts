export class AbstractHttpError extends Error {
  name = 'AbstractHttpError'

  public readonly status: number
  private readonly extraPayload: Record<string, unknown>

  constructor (status: number, message: string, extraPayload: Record<string, unknown> = {}) {
    super(message)
    this.status = status
    this.message = message
    this.extraPayload = extraPayload
  }

  public getErrorBody () {
    return Object.assign(this.extraPayload, { status: this.status, message: this.message })
  }
}
