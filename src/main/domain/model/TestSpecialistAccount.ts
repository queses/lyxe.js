import { Column, Entity } from 'typeorm'
import { TestEmbeddedMoney } from './TestEmbeddedMoney'
import { TestSpecialistAccountStatus } from './TestSpecialistAccountStatus'
import { TestSpecialistAccountPresentation } from './TestSpecialistAccountPresentation'
import { NumberIdEntity } from 'lyxe/lib/persistence-typeorm/NumberIdEntity'
import { HasComposedEntity } from 'lyxe/lib/persistence-typeorm/annotations/HasComposedEntity'
import { HasValuesCollection } from 'lyxe/lib/persistence-typeorm/annotations/HasValuesCollection'

@Entity()
export class TestSpecialistAccount extends NumberIdEntity {
  @Column(type => TestEmbeddedMoney)
  private balance: TestEmbeddedMoney

  @HasComposedEntity(type => TestSpecialistAccountPresentation)
  private presentation: Promise<TestSpecialistAccountPresentation | undefined>

  @HasValuesCollection(type => TestSpecialistAccountStatus)
  private statuses: TestSpecialistAccountStatus[]

  static create (balance: TestEmbeddedMoney) {
    const inst = new this()
    inst.balance = balance

    return inst
  }

  public getBalance () { return this.balance }
  public getStatuses () { return this.statuses }
  public getPresentation () { return this.presentation }

  public async addStatus (status: TestSpecialistAccountStatus) {
    if (!this.statuses) {
      this.statuses = [ status ]
    } else {
      this.statuses.push(status)
    }
  }

  public async removeStatus (status: TestSpecialistAccountStatus) {
    const index = this.statuses.findIndex(oldStatus => oldStatus.getValue() === status.getValue())
    if (index >= 0) {
      this.statuses.splice(index, 1)
    }
  }

  public async setPresentation (presentation: TestSpecialistAccountPresentation | undefined) {
    this.presentation = Promise.resolve(presentation)
  }
}
