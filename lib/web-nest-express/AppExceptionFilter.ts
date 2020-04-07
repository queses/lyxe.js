import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { AppError } from '../core/application-errors/AppError'
import { Cached } from '../core/lang/annotations/Cached'
import { AppContainer } from '../core/di/AppContainer'
import { AppErrorConverter } from '../web/AppErrorConverter'
import { Response } from 'express'

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  catch (exception: AppError, host: ArgumentsHost) {
    const httpError = this.converter.convert(exception)
    const res = host.switchToHttp().getResponse<Response>()
    res.status(httpError.status).json(httpError.getErrorBody())
  }

  @Cached()
  get converter () { return AppContainer.get(AppErrorConverter) }
}
