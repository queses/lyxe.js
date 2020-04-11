import { Column } from 'typeorm'
import { TestSpecialistAccountStatusType } from './TestSpecialistAccountStatusType'
import { TestSpecialistAccount } from './TestSpecialistAccount'
import { CollectedValueObject } from '../../../../lib/persistence-typeorm/CollectedValueObject'
import { ComposedCollectionElement } from '../../../../lib/persistence-typeorm/annotations/ComposedCollectionElement'
import { ComposedCollectionParent } from '../../../../lib/persistence-typeorm/annotations/ComposedCollectionParent'

@ComposedCollectionElement()
export class TestSpecialistAccountStatus extends CollectedValueObject<TestSpecialistAccount> {
  @Column()
  private value: TestSpecialistAccountStatusType

  @ComposedCollectionParent(type => TestSpecialistAccount)
  public readonly parent: Promise<TestSpecialistAccount>

  static create (value: TestSpecialistAccountStatusType) {
    const inst = new this()
    inst.value = value

    return inst
  }

  public getValue () { return this.value }
}
