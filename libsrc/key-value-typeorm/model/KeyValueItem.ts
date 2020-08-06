import { Column, Entity, PrimaryColumn } from 'typeorm'

/**
 * This entity is used only for automatic SQL-table creation
 */
@Entity()
export class KeyValueItem {
  @PrimaryColumn()
  public readonly key: string

  @Column({ type: 'text' })
  public readonly value: string

  constructor (key: string, value: string) {
    this.key = key
    this.value = value
  }

}
