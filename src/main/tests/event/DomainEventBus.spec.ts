import { assert } from 'chai'
import { IDomainEventHandler } from '../../../../libsrc/event/IDomainEventHandler'
import { IDomainEvent } from '../../../../libsrc/event/IDomainEvent'
import { AppContainer } from '../../../../libsrc/core/di/AppContainer'
import { DomainEventBusTkn } from '../../../../libsrc/event/lyxe-event-tokens'
import { DomainEventHandler } from '../../../../libsrc/event/annotations/DomainEventHandler'
import { TestUtil } from '../../../../libsrc/testing/TestUtil'
import { itInTransaction } from '../../../../libsrc/testing/mocha/it-in-transaction'

describe('DomainEventBus', function () {
  before(function () {
    DomainEventHandler(TestEvent.type)(TestSpyHandler)
  })

  it('should run without transaction', function () {
    const bus = AppContainer.get(DomainEventBusTkn)
    const oldCount = TestSpyHandler.handleCount

    bus.emit(TestUtil.createServiceFactory(undefined), TestEvent.type, new TestEvent())
    assert.equal(TestSpyHandler.handleCount, oldCount + 1)
  })

  itInTransaction('should not run until transaction commit', function (sf) {
    const bus = AppContainer.get(DomainEventBusTkn)
    const oldCount = TestSpyHandler.handleCount

    bus.emit(sf, TestEvent.type, new TestEvent())
    assert.equal(TestSpyHandler.handleCount, oldCount)
  }, 'test')
})

class TestEvent implements IDomainEvent {
  static type = Symbol('TestEvent')
}

export class TestSpyHandler implements IDomainEventHandler<TestEvent> {
  static handleCount = 0

  public handle (event: TestEvent): void {
    TestSpyHandler.handleCount++
  }
}
