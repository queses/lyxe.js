import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { DomainExceptionFilter } from './DomainExceptionFilter'
import { AppExceptionFilter } from './AppExceptionFilter'
import { AppEnv } from '../core/config/AppEnv'
import { AppConfigurator } from '../core/config/AppConfigurator'
import { CacheModule } from '@nestjs/common'
import { AppHttpCacheInterceptor } from './AppHttpCacheInterceptor'
import { ModuleMetadata } from '@nestjs/common/interfaces'

export class NestModuleMetaUtil {
  public static createModuleMeta (base: ModuleMetadata) {
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

    if (AppEnv.inProduction && AppConfigurator.get('web.cache')) {
      base.imports.push(CacheModule.register())
      base.providers.push({ provide: APP_INTERCEPTOR, useClass: AppHttpCacheInterceptor })
    }

    return base
  }
}
