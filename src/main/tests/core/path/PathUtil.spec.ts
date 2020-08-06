import { assert } from 'chai'
import * as path from 'path'
import { AppPathUtil } from '../../../../../libsrc/core/config/AppPathUtil'

describe('PathUtil', function () {
  it('should return app paths', function () {
    const appRoot = path.join(__dirname, '../../../../../../')
    const appData = path.join(appRoot, 'data')
    const appSrc = path.join(appRoot, 'dist/src')

    assert.equal(AppPathUtil.appSrc, appSrc)
    assert.equal(AppPathUtil.appData, appData)
  })
})
