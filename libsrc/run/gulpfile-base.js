const yargs = require('yargs')
const { series } = require('gulp')
const u = require('./GulpUtil')
const RunError = require('./RunError')

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

function lintLib () {
  const { fix, force } = argv
  return u.npmCommand(
    `eslint ${!force ? '--cache --cache-location .eslintcache.lib' : ''} ${fix ? '--fix' : ''} lib/**/*.ts`
  )
}

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
      args.unshift('DEBUGGER=1')
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
  '--dbg': 'Debug mode'
})

const execDo = series(
  tsc,
  function execDoRun () {
    const { cmd, dbg } = argv
    const args = ['node']

    if (!cmd) {
      throw new RunError('--cmd argument is required')
    }

    if (dbg) {
      args.unshift('DEBUGGER=1')
      args.push('--inspect-brk', '--nolazy')
    }

    args.push('./dist/src/app/console.js', cmd)
    return u.npmCrossEnv(args)
  }
)

u.setFlags(execDo, {
  '--cmd': 'Command in "controller:action" format',
  '--dbg': 'Debug mode'
})

function format () {
  return u.npmCommand('prettier --write "src/**/*.ts"')
}

module.exports = { clean, tsc, lint, lintLib, test, format, build, execDo }