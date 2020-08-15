import { SingletonService } from '../core/di/annotations/SingletonService'
import { NestModule } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TClass } from '../core/di/lyxe-di'
import { LyxeFramework } from '../core/LyxeFramework'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/lyxe-logging-tokens'
import { WebNestExpressConfig } from './WebNestExpressConfig'
import { ExpressCorsUtil } from '../web-express/ExpressCorsUtil'
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface'
import { AppPathUtil } from '../core/config/AppPathUtil'

@SingletonService()
export class NestExpressRunner {
  public async run (
    appModuleClass: TClass<NestModule>,
    modifyApp?: (app: NestExpressApplication) => void | Promise<void>
  ) {
    const [ app ] =  await Promise.all([
      NestFactory.create<NestExpressApplication>(
        appModuleClass,
        {
          logger: AppContainer.get(AppLoggerTkn)
        }
      ),
      LyxeFramework.run()
    ])

    if (WebNestExpressConfig.inst.useCors) {
      app.enableCors({
        origin: ExpressCorsUtil.getOriginWithSubdomains(AppConfigurator.get<string>('web.mainHost')) as CustomOrigin,
        optionsSuccessStatus: 200,
        credentials: true
      })
    }

    if (WebNestExpressConfig.inst.usePublicDirectory) {
      app.useStaticAssets(AppPathUtil.appData + '/public', { prefix: '/public/' })
    }

    if (WebNestExpressConfig.inst.useStaticRootDirectory) {
      app.useStaticAssets(AppPathUtil.appData + '/static-root')
    }

    if (modifyApp) {
      const modifyAppResult = modifyApp(app)
      if (modifyAppResult) {
        await modifyAppResult
      }
    }

    await app.listen(AppConfigurator.get<number>('web.port'))
  }
}
