import '../lib/core/register-lyxe'
import bootstrap from '../bootstrap'
import { AppModule } from './app.module'
import { LyxeFramework } from '../lib/core/LyxeFramework'
import { AppContainer } from '../lib/core/di/AppContainer'
import { NestExpressRunner } from '../lib/web-nest-express/NestExpressRunner'

const main = async () => {
  LyxeFramework.requirePlugins('web-nest-express')
  bootstrap()

  await AppContainer.get(NestExpressRunner).run(AppModule)
}

main().then()
