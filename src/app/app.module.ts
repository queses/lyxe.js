import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { NestModuleMetaUtil } from '../../lib/web-nest-express/NestModuleMetaUtil'
import { MainModule } from '../main/web/main.module'

@Module(
  NestModuleMetaUtil.createModuleMeta({
    imports: [ MainModule ]
  })
)
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {}
}
