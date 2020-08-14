import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { DomainErrorConverter } from '../web/DomainErrorConverter'
import { Response } from 'express'
import { DomainError } from '../core/domain-errors/DomainError'

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch (exception: DomainError, host: ArgumentsHost) {
    const httpError = this.converter.convert(exception)
    const res = host.switchToHttp().getResponse<Response>()
    res.status(httpError.status).json(httpError.getErrorBody())
  }

  @Cached()
  get converter () { return AppContainer.get(DomainErrorConverter) }
}
