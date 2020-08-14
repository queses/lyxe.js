export class CollectionUpdateUtil {
  static from <T, V extends string | number> (
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

  static async fromAsync <T, V extends string | number> (
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

  static fromObjects <T, V extends object> (
    oldCollection: T[], newValues: V[],
    getValueFromItem: (collectionItem: T) => V,
    createValue: (value: V, index: number, oldItem?: T) => T,
    transformNewValue?: (value: V) => V
  ): T[] {
    const newValuesAsStrings = (typeof transformNewValue === 'function')
      ? newValues.map(value => JSON.stringify(transformNewValue(value)))
      : newValues.map(value => JSON.stringify(value))

    const itemsMap = this.getChangesMap(
      oldCollection, newValuesAsStrings,
      collectionItem => JSON.stringify(getValueFromItem(collectionItem))
    )

    if (!itemsMap) {
      return oldCollection
    }

    const result: T[] = []
    for (const index in newValues) {
      const value = newValues[index]
      const newValueAsString = newValuesAsStrings[index]
      if (itemsMap.has(newValueAsString)) {
        result.push(createValue(value, parseInt(index, 10), itemsMap.get(newValueAsString)))
      } else {
        result.push(createValue(value, parseInt(index, 10)))
      }
    }

    return result
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
