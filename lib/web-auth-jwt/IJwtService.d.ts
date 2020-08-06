import { TAuthJwtPayload } from './luxie-web-auth-jwt'

export interface IJwtService {
  decryptAuthorities (encrypted: string): Promise<string[]>

  buildAuthToken <E extends {} = {}> (
    authId: number, authorities: string[], extraPayload: E, customDuration?: number
  ): Promise<string>

  buildRefreshToken (authId: number): Promise<string>

  verifyAndDecode <P extends {}> (token: string): Promise<P>

  getTokenTimeLeft <P extends TAuthJwtPayload> (token: P): number
}
