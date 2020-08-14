const stringArgv = require('string-argv').default
const path = require('path')
const spawn = require('cross-spawn')
const j = require('jake')

const nodeModulesDir = path.join(require.resolve('cross-spawn/package.json'), '../../.bin')

const run = (taskName) => {
  const t = j.Task[taskName]
  return new Promise((resolve) => {
    t.addListener('complete', resolve)
    t.invoke()
  })
}

const runSerial = async (...taskNames) => {
  for (const task of taskNames) {
    await run(task)
  }
}

const flag = (flag, description, type = Boolean) => {
  let typeName = type.name
  switch (type) {
    case Boolean:
      typeName = 'boolean'
      break
    case String:
      typeName = 'string'
      break
    case Number:
      typeName = 'number'
      break
    case Object:
      typeName = 'object'
      break
  }

  j.desc(`${j.currentTaskDescription}\n     └ ${flag}: ${typeName} - ${description}`)
}

const npmSpawn = (binary, args = []) => new Promise((resolve) => {
  const child = spawn(
    nodeModulesDir + '/' + binary,
    args,
    { cwd: process.cwd(), stdio: 'inherit' }
  )

  child.on('exit', (code) => {
    if (code) {
      process.exit(code)
    } else {
      resolve()
    }
  })

  process.on('SIGTERM', () => child.kill('SIGTERM'))
  process.on('SIGINT', () => child.kill('SIGINT'))
  process.on('SIGBREAK', () => child.kill('SIGBREAK'))
  process.on('SIGHUP', () => child.kill('SIGHUP'))
})

const npmCommand = function (command) {
    const args = stringArgv(command)
    return npmSpawn(args.shift(), args)
  }

const npmCrossEnv = function (args) {
  return npmSpawn('cross-env', args)
}

module.exports = { run, runSerial, flag, npmCommand, npmSpawn, npmCrossEnv }
