export interface IAppCache {
  /**
   * Gets value from cache
   * @param key cache record key
   */
  get <V> (key: string): Promise<V>

  /**
   * Puts value into cache
   * @param key cache record key
   * @param value value to cache
   * @param ttlSec time to store value, in seconds
   */
  set <V> (key: string, value: V, ttlSec?: number): Promise<void>

  /**
   * Removes value from cache
   * @param key cache record key
   */
  delete (key: string): Promise<void>
}