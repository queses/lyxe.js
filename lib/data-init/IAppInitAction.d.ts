export interface IAppInitAction {
  getKey (): string
  run (): void | Promise<void>
}
