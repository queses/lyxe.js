import { SingletonService } from '../core/di/annotations/SingletonService'
import { AbstractHttpError } from './errors/AbstractHttpError'
import { InjectService } from '../core/di/annotations/InjectService'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { IAppLogger } from '../logging/IAppLogger'
import { DomainError } from '../core/domain-errors/DomainError'
import { TObjectLiteral } from '../core/lang/lyxe-lang'
import { DomainEntityNotFoundError } from '../core/domain-errors/DomainEntityNotFoundError'
import { DomainInvalidArgumentError } from '../core/domain-errors/DomainInvalidArgumentError'
import { DomainAuthenticationNeededError } from '../core/domain-errors/DomainAuthenticationNeededError'
import { DomainAccessError } from '../core/domain-errors/DomainAccessError'
import { DomainEntityValidationError } from '../core/domain-errors/DomainEntityValidationError'

@SingletonService()
export class DomainErrorConverter {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  convert (error: DomainError): AbstractHttpError {
    let status: number
    let body: TObjectLiteral | undefined
    if (error instanceof DomainInvalidArgumentError) {
      status = 400
    } else if (error instanceof DomainEntityNotFoundError) {
      status = 404
    } else if (error instanceof DomainAuthenticationNeededError) {
      status = 401
    } else if (error instanceof DomainAccessError) {
      status = 403
    } else if (error instanceof DomainEntityValidationError) {
      status = 422
      body = error.errors
    } else {
      status = 500
      this.logger.error(error.message, error.stack)
    }

    return new AbstractHttpError(status, error.message, body)
  }
}
