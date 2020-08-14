import 'lyxe/lib/core/register-lyxe'
import { LyxeFramework } from 'lyxe/lib/core/LyxeFramework'
import { AppContainer } from 'lyxe/lib/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { NestExpressRunner } from 'lyxe/lib/web-nest-express/NestExpressRunner'
import { AppModule } from './app.module'

const main = async () => {
  LyxeFramework.requirePlugins('web-nest-express')
  bootstrap()

  await AppContainer.get(NestExpressRunner).run(AppModule)
}

main().then()
