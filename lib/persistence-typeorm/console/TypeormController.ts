import ConsoleController from '../../console/annotations/ConsoleController'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import { fork } from 'child_process'

@ConsoleController('lx:typeorm')
export class TypeormController {
  @ConsoleAction('default', 'Run actions for default connection')
  public runDefaultConnectionActions (args: string[]) {
    const typeormPath = require.resolve('typeorm')
    fork(typeormPath + './cli.js', args, { stdio: 'inherit' })
  }
}