import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'

export const asyncRoute = (handler: (req: Request, res: Response, next: NextFunction) => Promise<Record<string, any> | void>) =>  {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).then(res.json.bind(res)).catch(next)
  }
}