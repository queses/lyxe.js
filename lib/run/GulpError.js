class GulpError extends Error {
  constructor(message) {
    super()
    this.message = message
    this.name = 'GulpError'
  }
}

module.exports = GulpError
