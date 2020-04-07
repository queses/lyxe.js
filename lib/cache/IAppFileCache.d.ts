export interface IAppFileCache {
  get (key: string): Promise<Buffer | undefined>
  set (key: string, value: Buffer): Promise<void>
  delete (key: string): Promise<void>
  moveToPath (key: string, path: string): Promise<void>
}

