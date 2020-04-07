import { SingletonService } from '../core/di/annotations/SingletonService'
import { CacheModule, NestModule } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { APP_FILTER, APP_INTERCEPTOR, NestFactory } from '@nestjs/core'
import { DomainExceptionFilter } from './DomainExceptionFilter'
import { AppExceptionFilter } from './AppExceptionFilter'
import { AppEnv } from '../core/config/AppEnv'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { AppHttpCacheInterceptor } from './AppHttpCacheInterceptor'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TClass } from '../core/di/luxe-di'
import { LuxeFramework } from '../core/LuxeFramework'
import { AppContainer } from '../core/di/AppContainer'
import { AppLoggerTkn } from '../logging/luxe-logging-tokens'
import { WebNestExpressConfig } from './WebNestExpressConfig'
import { NestCorsUtil } from './NestCorsUtil'
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface'
import { AppPathUtil } from '../core/config/AppPathUtil'

@SingletonService()
export class NestExpressRunner {
  public async run (appModuleClass: TClass<NestModule>, runFramework: boolean = true): Promise<void> {
    const [ app ] =  await Promise.all([
      NestFactory.create<NestExpressApplication>(
        appModuleClass,
        {
          logger: AppContainer.get(AppLoggerTkn)
        }
      ),
      runFramework ? LuxeFramework.run() : undefined
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
  }

  public createModuleMeta (base: ModuleMetadata) {
    if (!base.imports) {
      base.imports = []
    }

    if (!base.providers) {
      base.providers = []
    }

    base.providers.push(
      { provide: APP_FILTER, useClass: DomainExceptionFilter },
      { provide: APP_FILTER, useClass: AppExceptionFilter }
    )

    if (AppEnv.inProduction && AppConfigurator.get('web.httpCache')) {
      base.imports.push(CacheModule.register())
      base.providers.push({ provide: APP_INTERCEPTOR, useClass: AppHttpCacheInterceptor })
    }
  }
}