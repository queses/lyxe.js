Object.assign(
  module.exports,
  require('./lib/run/gulpfile-base'),
  require('./lib/persistence-typeorm/run/gulpfile-typeorm')
)
