import 'reflect-metadata'
import 'source-map-support/register'
import { AppPathUtil } from './config/AppPathUtil'

require('dotenv').config()

const moduleAlias = require('module-alias')
moduleAlias.addAlias('src', AppPathUtil.appSrc)
moduleAlias.addAlias('lib', AppPathUtil.appLib)

process.on('unhandledRejection', (err) => {
  if (err) {
    console.error(err)
  }

  process.exit(1)
})
