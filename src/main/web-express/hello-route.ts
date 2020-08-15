import { Request, Response, Router } from 'express'
import { asyncRoute } from '../../lib/web-express/async-route'
import { DomainInvalidArgumentError } from '../../lib/core/domain-errors/DomainInvalidArgumentError'
import { DomainEntityValidationError } from '../../lib/core/domain-errors/DomainEntityValidationError'
import { EntityValidationErrorInfo } from '../../lib/persistence/EntityValidationErrorInfo'

export const helloRoute = Router()

helloRoute.get('/async', asyncRoute(async () => {
  await new Promise(r => setTimeout(r, 50))
  return ({ message: 'Hello from LyxeJS!', number: Math.random() })
}))

helloRoute.get('/error', asyncRoute(async () => {
  throw new DomainInvalidArgumentError('Invalid query param provided')
}))


helloRoute.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from LyxeJS!', number: Math.random() })
})

helloRoute.post('/', asyncRoute(async (req) => {
  if (!req.body || !req.body.name) {
    throw new DomainEntityValidationError(new EntityValidationErrorInfo('name', 'name is required'))
  }

  return { message: req.body.name + ', hello from LyxeJS!' }
}))
