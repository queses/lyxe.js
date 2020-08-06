import '../../libsrc/core/register-luxie'
import { LuxieFramework } from '../../libsrc/core/LuxieFramework'
import { AppContainer } from '../../libsrc/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { ConsoleRunner } from '../../libsrc/console/ConsoleRunner'

const main = async () => {
  LuxieFramework.requirePlugins('console')
  bootstrap()

  await LuxieFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
