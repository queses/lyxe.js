#!/usr/bin/env node

const yargs = require('yargs')
const jake = require('jake')
const path = require('path')

const argv = yargs.argv
const { _, $0, help, h, ...params } = argv
const jakefile = path.join(__dirname, './jakefile.js')

if (help || h || !_[0]) {
  jake.run.apply(jake, ['--jakefile', jakefile, '--tasks'])
} else {
  const args = Object.keys(params).map((key) => `${key}=${params[key]}`)
  args.unshift('--jakefile', jakefile)

  if (params.quiet) {
    args.unshift('--quiet')
  }

  if (_[1]) {
    args.push('cmd=' + _[1])
  }

  args.push(_[0])
  jake.run.apply(jake, args)
}
