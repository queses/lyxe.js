import { LuxeFramework } from '../../lib/core/LuxeFramework'
import { AppContainer } from '../../lib/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { NestExpressRunner } from '../../lib/web-nest-express/NestExpressRunner'
import { AppModule } from './app.module'

const main = async () => {
  LuxeFramework.requirePlugins('web-nest-express')
  bootstrap()

  await AppContainer.get(NestExpressRunner).run(AppModule)
}

main().then()
