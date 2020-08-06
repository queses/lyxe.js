import { QueryFailedError, QueryRunner } from 'typeorm'
import { TransactionError } from '../core/application-errors/TransactionError'

export class TypeormSqlSavepointManager {
  private lastSavepointId: number = 0

  public static get inst (): TypeormSqlSavepointManager {
    return Object.defineProperty(this, 'inst', { value: new this() }).inst
  }

  async createSavepoint (queryRunner: QueryRunner): Promise<string> {
    this.checkIfInTransaction(queryRunner, 'Cannot create savepoint without transaction')

    const key = this.nextSavepointKey()
    await queryRunner.query(`SAVEPOINT ${key}`)
    return key
  }

  async rollbackTo (savepointId: string, queryRunner: QueryRunner): Promise<void> {
    this.checkIfInTransaction(queryRunner, 'Cannot rollback to savepoint without transaction')

    try {
      await queryRunner.query(`ROLLBACK TO SAVEPOINT ${savepointId}`)
    } catch (err) {
      if (err instanceof QueryFailedError && err.message.includes(savepointId)) {
        throw new TransactionError('No savepoint found. Looks like you\'re trying to rollback committed nested transaction')
      } else {
        throw err
      }
    }
  }

  async commit (savepointId: string, queryRunner: QueryRunner) {
    await queryRunner.query(`RELEASE SAVEPOINT ${savepointId}`)
  }
  

  private checkIfInTransaction (queryRunner: QueryRunner, errorMessage: string) {
    if (!queryRunner.isTransactionActive) {
      throw new TransactionError(errorMessage)
    }
  }

  private nextSavepointKey () {
    return `sp_${++this.lastSavepointId}`
  }
}
