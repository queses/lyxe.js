import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AppEnv } from '../core/config/AppEnv'

@Injectable()
export class DevOnlyGuard implements CanActivate {
  public canActivate (context: ExecutionContext): boolean {
    return AppEnv.inDevelopment
  }
}
