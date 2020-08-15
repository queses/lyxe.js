import '../lib/core/register-lyxe'
import bootstrap from '../bootstrap'
import { LyxeFramework } from '../lib/core/LyxeFramework'
import { AppContainer } from '../lib/core/di/AppContainer'
import { ExpressRunner } from '../lib/web-express/ExpressRunner'
import { ExpressCacheMiddleware } from '../lib/web-express/ExpressCacheMiddleware'
import { helloRoute } from '../main/web-express/hello-route'
import { ExpressRequestLogMiddleware } from '../lib/web-express/ExpressRequestLogMiddleware'
import { WebExpressConfig } from '../lib/web-express/WebExpressConfig'

const main = async () => {
  LyxeFramework.requirePlugins('web-express')
  WebExpressConfig.basePath('/api')
  bootstrap()

  await AppContainer.get(ExpressRunner).run((app) => {
    app.use(ExpressRequestLogMiddleware.handler)

    // Use caching by default to test it:
    app.use(ExpressCacheMiddleware.handler)

    app.use('/api/hello', helloRoute)
  })
}

main().then()
