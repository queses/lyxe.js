import { Body, Controller, Get, Post } from '@nestjs/common'
import { TObjectLiteral } from '../../lib/core/lang/lyxe-lang'
import { DomainEntityValidationError } from '../../lib/core/domain-errors/DomainEntityValidationError'
import { EntityValidationErrorInfo } from '../../lib/persistence/EntityValidationErrorInfo'

@Controller('/api/hello')
export class HelloController {
  @Get('')
  public hello () {
    return { message: 'Hello from LyxeJS!' }
  }

  @Post('')
  public namedHello (@Body() body: TObjectLiteral) {
    if (!body || !body.name) {
      throw new DomainEntityValidationError(new EntityValidationErrorInfo('name', 'name is required'))
    }

    return { message: body.name + ', hello from LyxeJS!' }
  }
}
