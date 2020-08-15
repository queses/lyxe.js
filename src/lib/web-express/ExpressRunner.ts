import { SingletonService } from '../core/di/annotations/SingletonService'
import * as express from 'express'
import { ExpressCorsUtil } from './ExpressCorsUtil'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { WebNestExpressConfig } from '../web-nest-express/WebNestExpressConfig'
import { AppPathUtil } from '../core/config/AppPathUtil'
import { WebExpressConfig } from './WebExpressConfig'
import { InjectService } from '../core/di/annotations/InjectService'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { IAppLogger } from '../logging/IAppLogger'
import { AppEnv } from '../core/config/AppEnv'
import { ExpressAppErrorMiddleware } from './ExpressAppErrorMiddleware'
import { ExpressCacheMiddleware } from './ExpressCacheMiddleware'
import * as cors from 'cors'

@SingletonService()
export class ExpressRunner {
  @InjectService(AppLoggerTkn)
  private logger: IAppLogger

  public async run (modifyApp: (app: express.Application) => void | Promise<void>) {
    let basePath = WebExpressConfig.inst.basePath
    if (basePath[basePath.length - 1] !== '/') {
      basePath += '/'
    }

    const app = express()

    if (WebExpressConfig.inst.useCors) {
      app.use(basePath, cors({
        origin: ExpressCorsUtil.getOriginWithSubdomains(AppConfigurator.get<string>('web.mainHost')),
        optionsSuccessStatus: 200,
        credentials: true
      }))
    }

    if (WebNestExpressConfig.inst.usePublicDirectory) {
      app.use(basePath + 'public', express.static(AppPathUtil.appData + '/public'))
    }

    if (WebNestExpressConfig.inst.useStaticRootDirectory) {
      app.use(basePath, express.static(AppPathUtil.appData + '/static-root'))
    }

    if (AppEnv.inProduction && AppConfigurator.get('web.cache')) {
      app.use(basePath, ExpressCacheMiddleware.handler)
    }

    app.use(basePath, express.json())
    app.use(basePath, express.urlencoded({ extended: false }))

    if (modifyApp) {
      const modifyAppResult = modifyApp(app)
      if (modifyAppResult) {
        await modifyAppResult
      }
    }

    app.use(basePath, ExpressAppErrorMiddleware.handler)

    await app.listen(AppConfigurator.get<number>('web.port'))
    this.logger.log('App listening on port ' + 3000)
  }
}
