import { TAuthJwtPayload } from './lyxe-web-auth-jwt'

export interface IJwtService {
  decryptAuthorities (encrypted: string): Promise<string[]>

  buildAuthToken <E extends Record<string, string | number>> (
    authId: number, authorities: string[], extraPayload: E, customDuration?: number
  ): Promise<string>

  buildRefreshToken (authId: number): Promise<string>

  verifyAndDecode <P extends Record<string, unknown>> (token: string): Promise<P>

  getTokenTimeLeft <P extends TAuthJwtPayload> (token: P): number
}
