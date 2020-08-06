import '../../lib/core/register-luxie'
import { LuxieFramework } from '../../lib/core/LuxieFramework'
import { AppContainer } from '../../lib/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { ConsoleRunner } from '../../lib/console/ConsoleRunner'

const main = async () => {
  LuxieFramework.requirePlugins('console')
  bootstrap()

  await LuxieFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
