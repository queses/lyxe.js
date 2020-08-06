import { ObjectSchema, ValidationError } from 'yup'
import { DomainEntityValidationError } from '../core/domain-errors/DomainEntityValidationError'
import { EntityValidationErrorInfo } from '../persistence/EntityValidationErrorInfo'
import { SingletonService } from '../core/di/annotations/SingletonService'

@SingletonService()
export class YupValidator {
  async validateData  <T extends object> (schema: ObjectSchema<T>, data: T, skipUnknown: boolean = false) {
    this.removeEmptyFieldValues(data)

    try {
      await schema.validate(data, { abortEarly: false, stripUnknown: skipUnknown })
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new DomainEntityValidationError(this.extractErrorsInfo(e))
      }

      throw e
    }
  }

  private removeEmptyFieldValues <T extends {}> (values: T) {
    for (const field in values) {
      // noinspection JSUnfilteredForInLoop
      const value: any = values[field]
      if (value === '' || value === 'NaN') {
        // noinspection JSUnfilteredForInLoop
        delete values[field]
      } else if (typeof value !== 'object') {
        continue
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          this.removeEmptyFieldValues(item)
        }
      } else {
        this.removeEmptyFieldValues(value)
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