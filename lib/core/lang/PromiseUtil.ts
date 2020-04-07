import { CalculationTimeourError } from '../application-errors/CalculationTimeourError'
import { AppError } from '../application-errors/AppError'

export class PromiseUtil {
  static timeoutExecution <V> (promise: Promise<V>, operationDescription: string, timeoutMs: number = 2500): Promise<V> {
    return Promise.race([
      promise,
      new Promise((resolve, reject) => {
        return  setTimeout(() => reject(new CalculationTimeourError(operationDescription, timeoutMs)), timeoutMs)
      })
    ]) as Promise<V>
  }

  static limitPromiseMap <T, U> (concurrency: number, items: T[], mapper: (item: T, index: number, all: T[]) => Promise<U>) {
    const mapped: U[] = []

    const addPromise = (index: number): Promise<void> => {
      if (index >= items.length) {
        return Promise.resolve()
      }

      return mapper(items[index], index, items).catch(e => { throw e }).then(result => {
        mapped.push(result)
        return addPromise(index + concurrency)
      })
    }

    const promises: Array<Promise<void>> = []
    for (let i = 0; i < concurrency; i++) {
      promises.push(addPromise(i))
    }

    return Promise.all(promises).catch(e => {
      throw e
    }).then(() => {
      return mapped
    })
  }

  async waitForPromise (condition: () => boolean, timeStepMs: number = 200, maxWaitTimeMs = 5000) {
    const maxIndex = maxWaitTimeMs / timeStepMs
    let i = 0

    while (true) {
      if (i++ > maxIndex) {
        throw new AppError(`Wait for: ${maxWaitTimeMs}ms timeout exceeded`)
      }

      if (condition()) {
        break
      }

      await new Promise(r => setTimeout(r, timeStepMs))
    }
  }
}