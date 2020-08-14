import * as jwt from 'jsonwebtoken'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { JwtServiceTkn } from '../lyxe-web-auth-jwt-tokens'
import { IJwtService } from '../IJwtService'
import { CryptoServiceTkn } from '../../crypto/lyxe-crypto-tokens'
import { InjectService } from '../../core/di/annotations/InjectService'
import { ICryptoService } from '../../crypto/ICryptoService'
import { TAuthJwtPayload } from '../lyxe-web-auth-jwt'
import { AppConfigurator } from '../../core/config/AppConfigurator'
import { AppEnvConfigrationError } from '../../core/application-errors/AppEnvConfigrationError'

@SingletonService(JwtServiceTkn)
export class JwtService implements IJwtService {
  @InjectService(CryptoServiceTkn)
  private cryptoSrv: ICryptoService

  async buildAuthToken <E extends {} = {}> (
    authId: number, authorities: string[], extraPayload: E, customDuration?: number
  ): Promise<string> {
    const payload: Partial<TAuthJwtPayload<E>> = Object.assign({
      uid: authId.toString(),
      atl: await this.encryptAuthorities(authorities)
    }, extraPayload)

    return this.buildToken(payload, customDuration || AppConfigurator.get('auth.authTokenDuration'))
  }

  async buildRefreshToken (authId: number): Promise<string> {
    return this.buildToken({ uid: authId.toString() }, AppConfigurator.get('auth.refreshTokenDuration'))
  }

  async verifyAndDecode <P extends {}> (token: string): Promise<P> {
    return new Promise<P>((resolve, reject) => jwt.verify(
      token,
      this.signKey,
      {
        issuer: AppConfigurator.get<string>('web.frontendHost'),
        audience: AppConfigurator.get<string>('web.mainHost')
      },
      (err, decoded) => err ? reject(err) : resolve(decoded as P)
    ))
  }

  getTokenTimeLeft <P extends TAuthJwtPayload = TAuthJwtPayload> (token: P): number {
    const left = token ? Math.floor(token.exp - Date.now() / 1000) : 0
    return left > 0 ? left : 0
  }

  async decryptAuthorities (encrypted: string): Promise<string[]> {
    if (!encrypted) {
      return []
    }

    const decrypted = await this.cryptoSrv.decrypt(encrypted, 'JWT')
    return decrypted ? decrypted.split(',') : []
  }

  private async encryptAuthorities (authorities: string[]): Promise<string> {
    if (!authorities || !authorities.length) {
      return ''
    }

    return await this.cryptoSrv.encrypt(authorities.join(','), 'JWT')
  }

  private buildToken (payload: object, duration: number) {
    return new Promise<string>((resolve, reject) => jwt.sign(
      payload,
      this.signKey,
      {
        algorithm: 'HS384',
        expiresIn: duration,
        issuer: AppConfigurator.get<string>('web.frontendHost'),
        audience: AppConfigurator.get<string>('web.mainHost')
      },
      (err, encoded) => err ? reject(err) : resolve(encoded)
    ))
  }

  private get signKey () {
    if (!process.env.JWT_SIGN_KEY) {
      throw new AppEnvConfigrationError('JWT builder error: unable to find "JWT_SIGN_KEY" variable in environment')
    }

    return process.env.JWT_SIGN_KEY
  }
}
