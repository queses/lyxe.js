import { Controller, Get } from '@nestjs/common'

@Controller('hello')
export class HelloController {
  @Get('')
  public hello () {
    return 'Hello!'
  }
}
