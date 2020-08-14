import { QueryRunner } from 'typeorm'

export class TypeormTransactionPoolRegistry {
  private lastId: number = 0
  private queryRunners: {[key: number]: QueryRunner} = {}

  public static get inst (): TypeormTransactionPoolRegistry {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  public static register (queryRunner: QueryRunner) {
    return this.inst.register(queryRunner)
  }

  public static get (poolId: number) {
    return this.inst.get(poolId)
  }

  public static getAll () {
    return this.inst.queryRunners
  }

  public static clear (poolId: number) {
    delete this.inst.queryRunners[poolId]
  }

  public register (queryRunner: QueryRunner): number {
    const id = ++this.lastId
    this.queryRunners[id] = queryRunner
    return id
  }

  public get (poolId: number): QueryRunner | null {
    return this.queryRunners[poolId] || null
  }
}
