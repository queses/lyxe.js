const yargs = require('yargs')
const { series } = require('gulp')
const u = require('./GulpUtil')

const argv = yargs.argv

function clean () {
  return u.npmCommand('rimraf dist')
}

function tsc () {
  return u.npmCommand('tsc')
}

const build = series(lint, clean, tsc)

function lint () {
  const { fix, force } = argv
  return u.npmCommand(`eslint ${!force ? '--cache' : ''} ${fix ? '--fix' : ''} src/**/*.ts`)
}

u.setFlags(lint, {
  '--fix': 'Fix errors',
  '--force': 'Disable cache'
})

u.setFlags(lintLib, {
  '--fix': 'Fix errors',
  '--force': 'Disable cache'
})

const test = series(
  lint,
  tsc,
  function testRun () {
    const { slow, watch, only, dbg } = argv

    const args = ['NODE_ENV=test', './node_modules/mocha/bin/mocha']

    if (watch) {
      args.push('--watch')
    }

    if (dbg) {
      args.unshift('NODE_DEBUG=1')
      args.push('--inspect-brk', '--nolazy')
    }

    if (typeof only === 'string') {
      args.push('-g', only)
    } else if (!slow) {
      args.unshift('MOCHA_FAST_ONLY=true')
    }

    return u.npmCrossEnv(args)
  }
)

u.setFlags(test, {
  '--slow': 'Run also slow tests',
  '--watch': 'Watch files',
  '--only': 'Select test suites by RegExp',
  '--dbg': 'Debug'
})

function format () {
  return u.npmCommand('prettier --write "src/**/*.ts"')
}

module.exports = { clean, tsc, lint, test, format, build }
