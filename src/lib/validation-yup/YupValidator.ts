import { ObjectSchema, ValidationError } from 'yup'
import { DomainEntityValidationError } from '../core/domain-errors/DomainEntityValidationError'
import { EntityValidationErrorInfo } from '../persistence/EntityValidationErrorInfo'
import { SingletonService } from '../core/di/annotations/SingletonService'

@SingletonService()
export class YupValidator {
  async validateData <T extends Record<string, any>> (schema: ObjectSchema<T>, data: T, skipUnknown: boolean = false) {
    this.removeNaNFromValues(data)

    try {
      await schema.validate(data, { abortEarly: false, stripUnknown: skipUnknown })
    } catch (e) {
      if (e instanceof ValidationError || e.name === 'ValidationError') {
        throw new DomainEntityValidationError(this.extractErrorsInfo(e))
      }

      throw e
    }
  }

  private removeNaNFromValues <T extends Record<string, any>> (values: T): void {
    for (const field in values) {
      if (!values.hasOwnProperty(field)) {
        return
      }

      const value: any = values[field]
      if (isNaN(value) || value === 'NaN') {
        delete values[field]
      } else if (typeof value === 'object') {
        if (!Array.isArray(value)) {
          this.removeNaNFromValues(value)
        } else if (typeof value[0] === 'object') {
          for (const item of value) {
            this.removeNaNFromValues(item)
          }
        }
      }
    }
  }

  private extractErrorsInfo (error: ValidationError) {
    const messages: EntityValidationErrorInfo[] = []

    if (Array.isArray(error.inner)) {
      this.performErrorInfoExtracting(error.inner, messages)
    } else {
      this.performErrorInfoExtracting([ error ], messages)
    }

    return messages
  }

  private performErrorInfoExtracting  (errors: ValidationError[], messages: EntityValidationErrorInfo[], pathPrefix: string = '') {
    for (const error of errors) {
      let prefixedProperty: string
      if (pathPrefix) {
        prefixedProperty = pathPrefix + error.path
      } else {
        prefixedProperty = error.path
      }

      if (error.errors) {
        Object.values(error.errors).forEach(message => {
          messages.push(new EntityValidationErrorInfo(prefixedProperty, message))
        })
      }

      if (Array.isArray(error.inner)) {
        this.performErrorInfoExtracting(error.inner, messages, prefixedProperty)
      }
    }
  }
}
