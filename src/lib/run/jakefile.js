const { task, desc } = require('jake')
const { flag, npmCommand, runSerial, npmSpawn } = require('./jake-utils')
const RunError = require('./RunError')
const stringArgv = require('string-argv').default

desc('Clears TypeScript output directory')
task('clear', () => npmCommand('rimraf dist'))

desc('Runs TypeScript compiler')
task('tsc', () => npmCommand('tsc'))

desc('Runs ESLint on src folder')
flag('force', 'ignore cache')
flag('fix', 'fix errors')
task('lint', () => {
  const { fix, force } = process.env
  return npmCommand(`eslint ${!force ? '--cache' : ''} ${fix ? '--fix' : ''} "src/**/*.ts"`)
})

desc('Lints and builds code')
task('build', () => runSerial('lint', 'clear', 'tsc'))

task('lint-lib', () => {
  const { fix, force } = process.env
  return npmCommand(
    `eslint ${!force ? '--cache --cache-location .eslintcache.lib' : ''} ${fix ? '--fix' : ''} "src/lib/**/*.ts"`
  )
})

task('clear-lib', () => npmCommand('rimraf lib'))

task('copy-lib-d-ts', () => npmCommand('copyfiles -u 2 "src/lib/**/*.d.ts" lib'))

task('build-lib', () => {
  const { noclear } = process.env
  return runSerial('lint-lib')
    .then(() => noclear ? undefined : runSerial('clear-lib'))
    .then(() => npmCommand('tsc -p tsconfig.build.json'))
    .then(() => runSerial('copy-lib-d-ts'))
})

desc('Run tests')
flag('only', 'run only tests that matches provided RegExp', String)
flag('external', 'also run external tests')
flag('watch', 'watch files')
flag('dbg', 'debug mode')
task('test', ['lint', 'tsc'], () => {
  const { external, watch, only, dbg } = process.env
  const args = ['NODE_ENV=test', 'node']
  if (dbg) {
    args.unshift('DEBUGGER=1')
    args.push('--inspect-brk', '--nolazy')
  }

  args.push(require.resolve('mocha/bin/_mocha'))
  if (watch) {
    args.push('--watch')
  }

  if (typeof only === 'string' && only !== 'true') {
    args.push('-g', only)
  } else if (!external) {
    args.unshift('MOCHA_SPEC_ONLY=true')
  }

  return npmSpawn(args)
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

  args.push('./dist/app/console.js')
  return npmSpawn(args.concat(stringArgv(cmd)))
})

desc('Run web development server')
flag('dbg', 'debug mode')
flag('file', 'name of file that starts server')
task('dev', () => {
  const { dbg, file } = process.env
  const fileName = (file && typeof file === 'string') ? file : 'dist/app/web.js'

  if (dbg) {
    const args = ['DEBUGGER=1', 'node', '--inspect-brk', '--nolazy', fileName]
    return npmSpawn(args)
  } else {
    const args = ['nodemon', '--watch', 'src', '--ext', 'ts,js', '--ignore', '"src/**/*.spec.ts"']
    args.push('--exec', `tsc && node "${fileName}"`)
    return npmSpawn(args)
  }
})

require('../persistence-typeorm/run/jakefile-typeorm')
