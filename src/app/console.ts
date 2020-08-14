import 'lyxe/lib/core/register-lyxe'
import { LyxeFramework } from 'lyxe/lib/core/LyxeFramework'
import { AppContainer } from 'lyxe/lib/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { ConsoleRunner } from 'lyxe/lib/console/ConsoleRunner'

const main = async () => {
  LyxeFramework.requirePlugins('console')
  bootstrap()

  await LyxeFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
