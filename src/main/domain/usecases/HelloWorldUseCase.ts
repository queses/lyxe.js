import { HelloWorldUseCaseTkn } from '../../test-tokens'
import { BaseUseCase } from 'lyxe/lib/core/context/BaseUseCase'
import { IHelloWorldUseCase } from '../test-use-cases'
import { UseCase } from 'lyxe/lib/core/context/annotations/UseCase'

@UseCase(HelloWorldUseCaseTkn)
export class HelloWorldUseCase extends BaseUseCase implements IHelloWorldUseCase {
  public async run () {
    await new Promise((res) => setTimeout(res, 25))
    return 'Hello Word from UseCase!'
  }
}
