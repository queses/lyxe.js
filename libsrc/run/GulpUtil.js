const stringArgv = require('string-argv').default
const { spawn } = require('child_process')
const path = require('path')

const nodeModulesDir = path.join(require.resolve('cross-spawn/package.json'), '../../.bin')

module.exports = {
  npmSpawn (command, args) {
    return this.spawnBinary(command, args)
  },

  npmCrossEnv (args) {
    return this.spawnBinary('cross-env', args)
  },

  npmCommand (command) {
    const args = stringArgv(command)
    return this.spawnBinary(args.shift(), args)
  },

  setFlags (task, flags) {
    task.flags = flags
    return task
  },

  setDisplayName (task, displayName) {
    task.displayName = displayName
    return task
  },

  spawnBinary (name, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(
        nodeModulesDir + '/' + name,
        args,
        { cwd: process.cwd(), stdio: 'inherit' }
      )

      process.on('SIGTERM', () => child.kill('SIGTERM'))
      process.on('SIGINT', () => child.kill('SIGINT'))
      process.on('SIGBREAK', () => child.kill('SIGBREAK'))
      process.on('SIGHUP', () => child.kill('SIGHUP'))

      child.on('exit', (code) => {
        if (code) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }
}
