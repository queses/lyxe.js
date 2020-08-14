import { PrimaryGeneratedColumn } from 'typeorm'
import { IHasId } from '../persistence/IHasId'

export abstract class NumberIdEntity implements IHasId<number> {
  @PrimaryGeneratedColumn()
  private readonly id: number

  getId () {
    return this.id
  }
}
