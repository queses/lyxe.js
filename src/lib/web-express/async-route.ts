import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { TObjectLiteral } from '../core/lang/lyxe-lang'

export const asyncRoute = (handler: (req: Request, res: Response, next: NextFunction) => Promise<TObjectLiteral | void>) =>  {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).then(res.json.bind(res)).catch(next)
  }
}