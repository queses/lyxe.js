const stringArgv = require('string-argv').default
const j = require('jake')
const crossEnv = require('cross-env')

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

const npmSpawn = (args = []) => new Promise((resolve) => {
  crossEnv(args, { shell: true }).removeAllListeners('exit').on('exit', (code) => {
    if (code === 0) {
      resolve()
    } else {
      process.exit((code === null ) ? 1 : code)
    }
  })
})

const npmCommand = (command) => npmSpawn(stringArgv(command))

module.exports = { run, runSerial, flag, npmCommand, npmSpawn }
