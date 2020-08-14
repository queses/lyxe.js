export type TAuthJwtPayload <E extends {} = {}> = E & {
  iat?: number
  exp: number
  uid: string
  atl: string
}

export type TRefreshJwtPayload <E extends {} = {}> = E & { uid: string }
