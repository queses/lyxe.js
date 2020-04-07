import { IAppFileCache } from '../IAppFileCache'
import * as fs from 'fs'
import * as path from 'path'
import * as rimrafAsync from 'rimraf'
import { promisify } from 'util'
import { IAppCache } from '../IAppCache'
import { SingletonService } from '../../core/di/annotations/SingletonService'
import { AppCacheTkn, AppFileCacheTkn } from '../cache-manager/luxe-cache-tokens'
import { InjectService } from '../../core/di/annotations/InjectService'
import { ResourceNotFoundError } from '../../core/application-errors/ResourceNotFoundError'
import { InvalidArgumentError } from '../../core/application-errors/InvalidAgrumentError'
import { AppPathUtil } from '../../core/config/AppPathUtil'

const MAX_FILE_SIZE = 50000000 // 50 mb
const MAX_TTL_MS = 43200000 // 12 hours

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const rimraf = promisify(rimrafAsync)
const access = promisify(fs.access)
const rename = promisify(fs.rename)

@SingletonService(AppFileCacheTkn)
export class FsAppFileCache implements IAppFileCache {
  @InjectService(AppCacheTkn)
  private appCache: IAppCache

  private path = '/filecache'
  private lastCleaningAt?: number = Date.now()

  public async get (key: string): Promise<Buffer | undefined> {
    return readFile(this.transformKeyToPath(key)).catch(e => {
      // Return undefined if there was an error while opening file (e. g. if file is not exist)
      if (e.syscall === 'open') {
        return undefined
      } else {
        throw e
      }
    })
  }

  moveToPath (key: string, path: string): Promise<void> {
    const cachedPath = this.transformKeyToPath(key)
    return access(cachedPath)
      .then(() => rename(cachedPath, path))
      .catch(() => { throw new ResourceNotFoundError(`App File Cache Error: ${key} not found`) })
  }

  public async set (key: string, value: Buffer | string): Promise<void> {
    if (!value) {
      return
    } else if (!(value instanceof Buffer)) {
      value = Buffer.from(value)
    }

    if (value.byteLength > MAX_FILE_SIZE) {
      throw new InvalidArgumentError('File is too large to save in cache')
    }

    if (await this.lockWrite(key)) {
      await writeFile(this.checkAndTransformKeyToPath(key), value)
      await this.unlockWrite(key)
    } else {
      return
    }

    const now = Date.now()
    if (!this.lastCleaningAt || now > this.lastCleaningAt + MAX_TTL_MS) {
      this.lastCleaningAt = now
      this.cleanOld(now).catch(e => { throw e })
    }
  }

  async delete (key: string) {
    const filePath = this.transformKeyToPath(key)
    await access(filePath).then(() => rimraf(filePath)).catch(() => {})
  }

  private async lockWrite (key: string): Promise<boolean> {
    if (await this.appCache.get(key)) {
      return false
    } else {
      await this.appCache.set(key, true, 3600)
      return true
    }
  }

  public unlockWrite (key: string): Promise<void> {
    return this.appCache.delete(key)
  }

  private encodeKey (key: string) {
    return Buffer.from(key).toString('base64')
  }

  private transformKeyToPath (key: string) {
    return AppPathUtil.appData + this.path + '/' + this.encodeKey(key)
  }

  private checkAndTransformKeyToPath (key: string) {
    const encodedKey = this.encodeKey(key)
    if (encodedKey.length > 255) {
      throw new InvalidArgumentError('File name is too large to save in cache')
    }

    return AppPathUtil.appData + this.path + '/' + encodedKey
  }

  private async cleanOld (now: number = Date.now()): Promise<void> {
    const absolutePath = AppPathUtil.appData + this.path
    const files = await readdir(absolutePath)

    await Promise.all(files.map(async file => {
      if (file === '.gitkeep') {
        return
      }

      const filePath = path.join(absolutePath, file)
      const fileStat = await stat(filePath)

      if (now > new Date(fileStat.ctime).getTime() + MAX_TTL_MS) {
        return rimraf(filePath)
      }
    }))
  }
}
