export class CollectionUpdateUtil {
  static updateFrom <T, V extends string | number> (
    oldItems: T[], newValues: V[], getKeyFrom: (oldItem: T) => V,
    createValue: (value: V, index: number, oldItem?: T) => T
  ): T[] {
    const changes = this.getChangesMap(oldItems, newValues, getKeyFrom)
    if (!changes) {
      return oldItems
    }

    const result: T[] = []
    for (const index in newValues) {
      const value = newValues[index]
      if (changes.has(value)) {
        result.push(createValue(value, parseInt(index, 10), changes.get(value)))
      } else {
        result.push(createValue(value, parseInt(index, 10)))
      }
    }

    return result
  }

  static async updateFromAsync <T, V extends string | number> (
    oldItems: T[], newValues: V[], getKeyFrom: (oldItem: T) => V,
    createValue: (value: V, index: number, oldItem?: T) => Promise<T>
  ): Promise<T[]> {
    const changes = this.getChangesMap(oldItems, newValues, getKeyFrom)
    if (!changes) {
      return oldItems
    }

    return await Promise.all(newValues.map((value, index) => {
      if (changes.has(value)) {
        return createValue(value, index, changes.get(value))
      } else {
        return createValue(value, index)
      }
    }))
  }

  static getChangesMap <T, V> (oldItems: T[], newValues: V[], getKeyFrom: (oldItem: T) => V): Map<V, T> | undefined {
    const oldItemsMap = new Map<V, T>()

    let shouldBeUpdated = (oldItems.length !== newValues.length)
    for (const index in oldItems) {
      const key = getKeyFrom(oldItems[index])
      if (key !== newValues[index]) {
        shouldBeUpdated = true
      }

      oldItemsMap.set(key, oldItems[index])
    }

    return (shouldBeUpdated) ? oldItemsMap : undefined
  }
}