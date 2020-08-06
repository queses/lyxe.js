import { SingletonService } from '../core/di/annotations/SingletonService'
import { NestModule } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TClass } from '../core/di/luxie-di'
import { LuxieFramework } from '../core/LuxieFramework'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/luxie-logging-tokens'
import { WebNestExpressConfig } from './WebNestExpressConfig'
import { NestCorsUtil } from './NestCorsUtil'
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface'
import { AppPathUtil } from '../core/config/AppPathUtil'

@SingletonService()
export class NestExpressRunner {
  public async run (appModuleClass: TClass<NestModule>, runFramework: boolean = true) {
    const [ app ] =  await Promise.all([
      NestFactory.create<NestExpressApplication>(
        appModuleClass,
        {
          logger: AppContainer.get(AppLoggerTkn)
        }
      ),
      runFramework ? LuxieFramework.run() : undefined
    ])

    if (WebNestExpressConfig.inst.useCors) {
      app.enableCors({
        origin: NestCorsUtil.getOriginWithSubdomains(AppConfigurator.get<string>('web.mainHost')) as CustomOrigin,
        credentials: true
      })
    }

    if (WebNestExpressConfig.inst.useStaticDirectory) {
      app.useStaticAssets(AppPathUtil.appData + '/public', { prefix: '/public/' })
      app.useStaticAssets(AppPathUtil.appData + '/static-root')
    }

    await app.listen(AppConfigurator.get<number>('web.port'))

    return app
  }
}
