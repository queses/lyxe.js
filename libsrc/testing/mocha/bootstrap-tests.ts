import '../../core/register-luxie'
import * as sinon from 'sinon'
import { use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { AppPathUtil } from '../../core/config/AppPathUtil'
import { AppConfigurationError } from '../../core/application-errors/AppConfigurationError'
import { LuxieFramework } from '../../core/LuxieFramework'

use(chaiAsPromised)

let bootstrapApp: (() => void) | undefined
try {
  bootstrapApp = require(AppPathUtil.appSrc + '/bootstrap').default
} catch (e) {
  // No bootstrap file in "src" folder found
}

if (!bootstrapApp) {
  throw new AppConfigurationError('Cannot find application bootstrap file. Tests cannot be started')
}

bootstrapApp()

before(async function () {
  await LuxieFramework.run()
})

after(async function () {
  await LuxieFramework.shutdown()
})

afterEach(() => {
  // Restore the default sandbox
  sinon.restore()
})
