import '../../libsrc/core/register-lyxe'
import { LyxeFramework } from '../../libsrc/core/LyxeFramework'
import { AppContainer } from '../../libsrc/core/di/AppContainer'
import bootstrap from '../bootstrap'
import { ConsoleRunner } from '../../libsrc/console/ConsoleRunner'

const main = async () => {
  LyxeFramework.requirePlugins('console')
  bootstrap()

  await LyxeFramework.run()
  await AppContainer.get(ConsoleRunner).run()
}

main().then()
