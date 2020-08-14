import { HelloWorldUseCaseTkn } from '../../test-tokens'
import { IHelloWorldUseCase } from '../test-use-cases'
import { UseCase } from '../../../lib/core/context/annotations/UseCase'
import { BaseUseCase } from '../../../lib/core/context/BaseUseCase'

@UseCase(HelloWorldUseCaseTkn)
export class HelloWorldUseCase extends BaseUseCase implements IHelloWorldUseCase {
  public async run () {
    await new Promise((res) => setTimeout(res, 25))
    return 'Hello Word from UseCase!'
  }
}
