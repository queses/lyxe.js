export interface IAppLogger {
  log (message: string): void
  error (message: string, stack?: string): void
  warn (message: any): void
  debug (message: any): void
}
