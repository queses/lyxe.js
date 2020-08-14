import { assert } from 'chai'
import { itInTransaction } from '../../../lib/testing/mocha/it-in-transaction'
import { AppContainer } from '../../../lib/core/di/AppContainer'
import { DomainEventBusTkn } from '../../../lib/event/lyxe-event-tokens'
import { IDomainEvent } from '../../../lib/event/IDomainEvent'
import { IDomainEventHandler } from '../../../lib/event/IDomainEventHandler'
import { DomainEventHandler } from '../../../lib/event/annotations/DomainEventHandler'
import { TestUtil } from '../../../lib/testing/TestUtil'

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
