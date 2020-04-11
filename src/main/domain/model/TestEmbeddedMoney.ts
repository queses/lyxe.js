import { Column } from 'typeorm'

export class TestEmbeddedMoney {
  @Column()
  private readonly value: number

  constructor(value: number) {
    this.value = value
  }

  public getValue () { return this.value }
}
