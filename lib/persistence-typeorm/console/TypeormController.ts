import ConsoleController from '../../console/annotations/ConsoleController'
import ConsoleAction from '../../console/annotations/ConsoleAction'
import { fork } from 'child_process'

@ConsoleController('lx:typeorm')
export class TypeormController {
  @ConsoleAction('default', 'Run actions for default connection')
  public runDefaultConnectionActions (args: string[]) {
    const typeormIndexPath = require.resolve('typeorm')
    const typeormIndex = typeormIndexPath.indexOf('typeorm')
    const typeormPath = typeormIndexPath.substring(0, typeormIndex + 8)
    fork(typeormPath + '/cli.js', args, { stdio: 'inherit' })
  }
}