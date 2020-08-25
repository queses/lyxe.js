const { task, desc } = require('jake')
const { npmSpawn, flag } = require('../../run/jake-utils')
const RunError = require('../../run/RunError')

desc('Runs TypeORM CLI command')
flag('cmd', 'TypeORM command', String)
flag('test', 'Run in test environment')
flag('prod', 'Run in production environment')
task('orm', ['tsc'], () => {
  const { cmd, test, prod } = process.env

  if (typeof cmd !== 'string') {
    throw new RunError('--cmd argument is required')
  }

  const args = [ './node_modules/typeorm/cli.js', cmd ]
  if (test) {
    args.unshift('NODE_ENV=test')
  } else if (prod) {
    args.unshift('NODE_ENV=production')
  }

  return npmSpawn(args)
})
