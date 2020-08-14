import { TestSpecialistAccount } from '../../domain/model/TestSpecialistAccount'
import { TestEmbeddedMoney } from '../../domain/model/TestEmbeddedMoney'
import { BaseDomainFixture } from '../../../lib/testing/fixture/BaseDomainFixture'

export class TestSpecialistAccountFixture extends BaseDomainFixture {
  public getEntities() {
    return {
      positiveBalance: this.entity(1, TestSpecialistAccount.create(new TestEmbeddedMoney(1000))),
      zeroBalance: this.entity(2, TestSpecialistAccount.create(new TestEmbeddedMoney(0))),
      negativeBalance: this.entity(3, TestSpecialistAccount.create(new TestEmbeddedMoney(-1000))),
    }
  }
}
