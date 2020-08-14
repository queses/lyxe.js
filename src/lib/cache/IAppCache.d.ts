export interface IAppCache {
  get <V> (key: string): Promise<V>
  set <V> (key: string, value: V, ttl?: number): Promise<void>
  delete (key: string): Promise<void>
}