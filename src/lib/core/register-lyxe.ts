import { AppPathUtil } from './config/AppPathUtil'

require('reflect-metadata')
require('source-map-support/register')
require('dotenv').config()
require('module-alias').addAlias('src', AppPathUtil.appSrc)

process.on('unhandledRejection', (err) => {
  if (err) {
    console.error(err)
  }

  process.exit(1)
})
