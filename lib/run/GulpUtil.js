const npmRun = require('npm-run')
const stringArgv = require('string-argv').default
const { spawn } = require('child_process')

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
    const cwd = process.cwd()
    if (process.platform === 'win32') {
      return spawn('cmd.exe', ['/c', `${cwd}/node_modules/.bin/${name}.cmd`, ...args], { cwd, stdio: 'inherit' })
    } else {
      return npmRun.spawn(name, args, { cwd, stdio: 'inherit' })
    }
  }
}
