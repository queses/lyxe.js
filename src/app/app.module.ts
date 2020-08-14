import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MainModule } from '../main/web/main.module'
import { NestModuleMetaUtil } from '../lib/web-nest-express/NestModuleMetaUtil'

@Module(
  NestModuleMetaUtil.createModuleMeta({
    imports: [ MainModule ]
  })
)
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {}
}
