import '../../libsrc/core/register-lyxe'
import { LyxeFramework } from '../../libsrc/core/LyxeFramework'
import { AppContainer } from '../../libsrc/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { NestExpressRunner } from '../../libsrc/web-nest-express/NestExpressRunner'
import { AppModule } from './app.module'

const main = async () => {
  LyxeFramework.requirePlugins('web-nest-express')
  bootstrap()

  await AppContainer.get(NestExpressRunner).run(AppModule)
}

main().then()
