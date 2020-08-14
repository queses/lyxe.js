import 'lyxe/lib/core/register-lyxe'
import bootstrap from '../bootstrap'
import { LyxeFramework } from '../lib/core/LyxeFramework'
import { AppContainer } from '../lib/core/di/AppContainer'
import { ConsoleRunner } from '../lib/console/ConsoleRunner'

const main = async () => {
  LyxeFramework.requirePlugins('console')
  bootstrap()

  await LyxeFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
