import { assert, AssertionError } from 'chai'
import * as yup from 'yup'
import { AppContainer } from '../../../lib/core/di/AppContainer'
import { YupValidator } from '../../../lib/validation-yup/YupValidator'
import { DomainEntityValidationError } from '../../../lib/core/domain-errors/DomainEntityValidationError'

describe('YupValidator', function () {
  it('should pass valid object', async function () {
    const validator = AppContainer.get(YupValidator)
    const data = {
      name: 'John',
      contact: {
        phone: 332211,
        email: 'johncena@gmail.com'
      }
    }

    await validator.validateData(getSchema(), data)
  })

  it('should reject invalid object', async function () {
    const validator = AppContainer.get(YupValidator)
    const data = {
      name: 'N',
      contact: {
        phone: 332211,
        email: 'N'
      }
    }

    let error: DomainEntityValidationError<any, any> | undefined
    try {
      await validator.validateData(getSchema(), data)
    } catch (e) {
      if (e instanceof DomainEntityValidationError) {
        error = e
      } else {
        throw e
      }
    }

    if (!error) {
      throw new AssertionError('Error should be defined')
    }

    assert.lengthOf(error.errors, 2)
    assert.equal(error.errors[0].path, 'name')
    assert.equal(error.errors[1].path, 'contact.email')
  })

  it('should remove empty fields', async function () {
    const validator = AppContainer.get(YupValidator)
    const data = {
      name: 'John',
      contact: {
        phone: 332211,
        email: 'example@mail.com',
        comment: ''
      }
    }

    await assert.isRejected(validator.validateData(getSchema(), data, false), DomainEntityValidationError)
    await assert.isFulfilled(validator.validateData(getSchema(), data, true))
  })
})

const getSchema = () => yup.object({
  name: yup.string().required().min(2),
  contact: yup.object({
    phone: yup.number().required().min(4),
    email: yup.string().required().min(6),
    comment: yup.string().min(8)
  })
})
