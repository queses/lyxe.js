import { PromiseUtil } from './PromiseUtil'

export class LimitedPromisesPool {
  private pendingCounter: number = 0
  private delayed: Array<[ () => Promise<void>, ((err: Error) => void) | undefined ]> = []

  constructor (private readonly concurrency: number) {}

  add (callPromise: () => Promise<void>, onCatch?: (err: Error) => void) {
    if (this.pendingCounter < this.concurrency) {
      this.pendingCounter++
      callPromise().then(this.afterPromise.bind(this)).catch(async (err) => {
        if (typeof onCatch !== 'function') {
          throw err
        }

        onCatch(err)
        this.afterPromise()
      })
    } else {
      this.delayed.push([callPromise, onCatch])
    }
  }

  get hasPending () {
    return this.pendingCounter > 0
  }

  waitForAll () {
    return PromiseUtil.waitFor(() => !this.hasPending, 25)
  }

  private afterPromise () {
    const delayed = this.delayed.shift()
    if (delayed && typeof delayed[0] === 'function') {
      delayed[0]().then(this.afterPromise.bind(this)).catch((err) => {
        if (typeof delayed[1] !== 'function') {
          throw err
        }

        delayed[1](err)
        this.pendingCounter--
      })
    } else {
      this.pendingCounter--
    }
  }
}