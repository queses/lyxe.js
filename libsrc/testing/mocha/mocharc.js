const getTargets = function () {
  const testTypeWildcard = process.env.MOCHA_SPEC_ONLY ? '(spec)' : '(spec|external)'
  return [ `./dist/src/*/tests/**/*\.@${testTypeWildcard}.js` ]
}

module.exports = {
  timeout: (!!process.env.DEBUGGER) ? 36000000 : 60000,
  extension: 'js',
  spec: [
    __dirname + '/bootstrap-tests.js',
    getTargets()
  ]
}
