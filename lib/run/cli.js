#!/usr/bin/env node

const yargs = require('yargs')
const jake = require('jake')

const argv = yargs.argv
const { _, $0, help, h, ...params } = argv

if (help || h || !_[0]) {
  jake.run.apply(jake, ['--tasks'])
} else {
  const args = Object.keys(params).map((key) => `${key}=${params[key]}`)

  if (params.quiet) {
    args.unshift('--quiet')
  }

  if (_[1]) {
    args.push('cmd=' + _[1])
  }

  args.push(_[0])
  jake.run.apply(jake, args)
}
