import { Column } from 'typeorm'

export class TestPhoto {
  @Column({ type: 'varchar', length: 2048, nullable: true })
  private readonly url: string

  @Column({ nullable: true })
  private uploadedAt: Date

  constructor (url: string) {
    this.url = url
    this.uploadedAt = new Date()
  }

  public getUrl () { return this.url }
}
