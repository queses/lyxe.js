import { AppContainer } from '../../../lib/core/di/AppContainer'
import { ServiceFactory } from '../../../lib/core/context/ServiceFactory'
import { TAuthContextInfo } from '../../../lib/auth/auth-context'
import { assert } from 'chai'
import { AuthCheck } from '../../../lib/auth/AuthCheck'
import { DomainAccessError } from '../../../lib/core/domain-errors/DomainAccessError'

describe('AuthCheck', function () {
  it('should check system', function () {
    const sfSystem = AppContainer.get(ServiceFactory).configure(createAuthContext([], true))
    assert.doesNotThrow(() => AuthCheck.of(sfSystem).systemOnly())

    const sfNoSystem = AppContainer.get(ServiceFactory).configure(createAuthContext([], false))
    assert.throws(() => AuthCheck.of(sfNoSystem).systemOnly(), DomainAccessError)

    const sfSystemNoAuth = AppContainer.get(ServiceFactory).configure({ asSystem: true })
    assert.doesNotThrow(() => AuthCheck.of(sfSystemNoAuth).systemOnly())
  })

  it('should check and strict check', function () {
    const sfSystem = AppContainer.get(ServiceFactory).configure(createAuthContext(['USER'], true))
    const sfNoSystem = AppContainer.get(ServiceFactory).configure(createAuthContext([], false))

    assert.doesNotThrow(() => AuthCheck.of(sfSystem).has('USER'))
    assert.doesNotThrow(() => AuthCheck.of(sfSystem).has('USER'))

    assert.throws(() => AuthCheck.of(sfNoSystem).has('ADMIN'), DomainAccessError)
    assert.doesNotThrow(() => AuthCheck.of(sfSystem).has('ADMIN'))
    assert.throws(() => AuthCheck.of(sfSystem).hasStrict('ADMIN'), DomainAccessError)
  })

  it('should check complex', function () {
    const sf = AppContainer.get(ServiceFactory).configure(createAuthContext(['USER', 'READER', 'AUTHOR'], false))
    assert.doesNotThrow(() => AuthCheck.of(sf).has('USER', 'ADMIN'))
    assert.throws(() => AuthCheck.of(sf).has(['USER', 'ADMIN']), DomainAccessError)
    assert.throws(() => AuthCheck.of(sf).has(['USER', 'ADMIN'], 'ADMIN'), DomainAccessError)
    assert.doesNotThrow(() => AuthCheck.of(sf).has(['USER', 'READER', 'AUTHOR']))
    assert.doesNotThrow(() => AuthCheck.of(sf).has(['USER', 'READER', 'AUTHOR'], 'ADMIN'))
  })

  it('should get has authorities', function () {
    const sf = AppContainer.get(ServiceFactory).configure(createAuthContext(['USER', 'READER', 'AUTHOR'], false))
    assert.isTrue(AuthCheck.getHas(sf, 'USER', 'ADMIN'))
    assert.isFalse(AuthCheck.getHas(sf, ['USER', 'ADMIN']))
    assert.isTrue(AuthCheck.getHas(sf, ['USER', 'READER', 'AUTHOR']))

    const sfNoAuth = AppContainer.get(ServiceFactory).configure({ asSystem: false })
    assert.isFalse(AuthCheck.getHas(sfNoAuth, 'USER'))

    const sfSystemNoAuth = AppContainer.get(ServiceFactory).configure({ asSystem: true })
    assert.isTrue(AuthCheck.getHas(sfSystemNoAuth, 'USER'))
    assert.isFalse(AuthCheck.getHasStrict(sfSystemNoAuth, 'USER'))

    assert.isTrue(AuthCheck.getHas({ asSystem: true }, 'USER'))
    assert.isFalse(AuthCheck.getHas(undefined, 'USER'))
  })
})

const createAuthContext = (authorities: string[], asSystem: boolean): TAuthContextInfo => ({
  asSystem,
  auth: {
    authorities,
    authId: 1
  }
})