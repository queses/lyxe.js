import '../../libsrc/core/register-luxie'
import { LuxieFramework } from '../../libsrc/core/LuxieFramework'
import { AppContainer } from '../../libsrc/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { NestExpressRunner } from '../../libsrc/web-nest-express/NestExpressRunner'
import { AppModule } from './app.module'

const main = async () => {
  LuxieFramework.requirePlugins('web-nest-express')
  bootstrap()

  await AppContainer.get(NestExpressRunner).run(AppModule)
}

main().then()
