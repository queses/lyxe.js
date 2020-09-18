export type TAuthJwtPayload <E extends Record<string, string> = Record<string, string>> = E & {
  iat?: string
  exp: string
  uid: string
  atl: string
}

export type TRefreshJwtPayload <E extends Record<string, string> = Record<string, string>> = E & {
  uid: string
}
