class RunError extends Error {
  constructor(message) {
    super()
    this.message = message
    this.name = 'RunError'
  }
}

module.exports = RunError
