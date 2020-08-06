import { Column, Entity } from 'typeorm'
import { TestSpecialistAccountAvatar } from './TestSpecialistAccountAvatar'
import { TestSpecialistAccount } from './TestSpecialistAccount'
import { ComposedEntity } from '../../../../libsrc/persistence-typeorm/ComposedEntity'
import { HasComposedCollection } from '../../../../libsrc/persistence-typeorm/annotations/HasComposedCollection'
import { ComposedEntityParent } from '../../../../libsrc/persistence-typeorm/annotations/ComposedEntityParent'

@Entity()
export class TestSpecialistAccountPresentation extends ComposedEntity<TestSpecialistAccount> {
  @Column()
  private description: string

  @HasComposedCollection(type => TestSpecialistAccountAvatar)
  private avatars: Promise<TestSpecialistAccountAvatar[]>

  @ComposedEntityParent(type => TestSpecialistAccount)
  public readonly parent: Promise<TestSpecialistAccount>

  static create (description: string, avatars: TestSpecialistAccountAvatar[]) {
    const inst = new this()
    inst.description = description
    inst.avatars = Promise.resolve(avatars)

    return inst
  }

  public async getAvatarCount () { return (await this.avatars).length }
  public getAvatars () { return this.avatars }
  public getDescription () { return this.description }
}
