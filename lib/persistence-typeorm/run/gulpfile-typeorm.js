const yargs = require('yargs')
const gulp = require('gulp')
const u = require('../../run/GulpUtil')
const GulpError = require('../../run/GulpError')
const base = require('../../run/gulpfile-base')

const argv = yargs.argv

const orm = gulp.series(
  base.lint,
  base.tsc,
  function ormRun () {
    const { cmd, test, prod } = argv

    if (typeof cmd !== 'string') {
      throw new GulpError('--cmd argument is required')
    }

    const args = [ './node_modules/typeorm/cli.js', cmd ]
    if (test) {
      args.unshift('NODE_ENV=test')
    } else if (prod) {
      args.unshift('NODE_ENV=production')
    }

    return u.npmCrossEnv(args)
  }
)

u.setFlags(orm, {
  '--cmd': 'TypeORM CLI command',
  '--test': 'Run in test environment',
  '--prod':  'Run in prod environment'
})

module.exports = { orm }