const { task, desc } = require('jake')
const { flag, npmCommand, runSerial, npmCrossEnv, npmSpawn } = require('./jake-utils')
const RunError = require('./RunError')

desc('Cleans TypeScript output directory')
task('clean', () => npmCommand('rimraf dist'))

desc('Runs TypeScript compiler')
task('tsc', () => npmCommand('tsc'))

desc('Runs ESLint on src folder')
flag('force', 'ignore cache')
flag('fix', 'fix errors')
task('lint', () => {
  const { fix, force } = process.env
  return npmCommand(`eslint ${!force ? '--cache' : ''} ${fix ? '--fix' : ''} src/**/*.ts`)
})

desc('Lints and builds code')
task('build', () => runSerial('lint', 'clean', 'tsc'))

task('lint-lib', () => {
  const { fix, force } = process.env
  return npmCommand(
    `eslint ${!force ? '--cache --cache-location .eslintcache.lib' : ''} ${fix ? '--fix' : ''} libsrc/**/*.ts`
  )
})

task('copy-lib-d-ts', () => npmCommand('copyfiles -u 1 "libsrc/**/*.d.ts" lib'))
task('build-lib', () => {
  return runSerial('lint-lib', 'clean')
    .then(() => npmCommand('tsc -p tsconfig.build.json'))
    .then(() => runSerial('copy-lib-d-ts'))
})

desc('Run tests')
flag('only', 'run only tests that matches provided RegExp', String)
flag('slow', 'also run slow tests')
flag('watch', 'watch files')
flag('dbg', 'debug mode')
task('test', ['lint', 'tsc'], () => {
  const { slow, watch, only, dbg } = process.env
  const args = ['NODE_ENV=test', './node_modules/mocha/bin/mocha']

  if (watch) {
    args.push('--watch')
  }

  if (dbg) {
    args.unshift('DEBUGGER=1')
    args.push('--inspect-brk', '--nolazy')
  }

  if (typeof only === 'string' && only !== 'true') {
    args.push('-g', only)
  } else if (!slow) {
    args.unshift('MOCHA_FAST_ONLY=true')
  }

  return npmCrossEnv(args)
})

desc('Perform application console action')
flag('cmd', 'command in "controller:action" format', String)
flag('dbg', 'debug mode')
task('do', ['tsc'], () => {
  const { cmd, dbg } = process.env
  const args = ['node']

  if (!cmd) {
    throw new RunError('--cmd argument is required')
  }

  if (dbg) {
    args.unshift('DEBUGGER=1')
    args.push('--inspect-brk', '--nolazy')
  }

  args.push('./dist/src/app/console.js', cmd)
  return npmCrossEnv(args)
})

desc('Run web development server')
flag('dbg', 'debug mode')
task('dev', () => {
  const { dbg } = process.env

  if (dbg) {
    const args = ['DEBUGGER=1', 'node', '--inspect-brk', '--nolazy']
    return npmCrossEnv(args)
  } else {
    const args = ['--watch', 'src', '--ext', 'ts,js', '--ignore', 'src/**/*.spec.ts']
    args.push('--exec', 'tsc && node dist/src/app/web.js')
    return npmSpawn('nodemon', args)
  }
})

require('../persistence-typeorm/run/jakefile-typeorm')
