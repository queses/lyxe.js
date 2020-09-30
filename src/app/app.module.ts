import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MainModule } from '../main/web/main.module'
import { NestModuleMetaUtil } from '../lib/web-nest-express/NestModuleMetaUtil'
import { NestRequestLoggerMiddleware } from '../lib/web-nest-express/NestRequestLogger.middleware'

@Module(
  NestModuleMetaUtil.createModuleMeta({
    imports: [ MainModule ]
  })
)
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(NestRequestLoggerMiddleware)
      .forRoutes('api/*')
  }
}
