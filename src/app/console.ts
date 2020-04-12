import { LuxeFramework } from '../../lib/core/LuxeFramework'
import { AppContainer } from '../../lib/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { ConsoleRunner } from '../../lib/console/ConsoleRunner'

const main = async () => {
  LuxeFramework.requirePlugins('console')
  bootstrap()

  await LuxeFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
