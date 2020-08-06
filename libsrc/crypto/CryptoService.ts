import { SingletonService } from '../core/di/annotations/SingletonService'
import { CryptoServiceTkn } from './luxie-crypto-tokens'
import { TCryptoHashType, TCryptoScenario, TCryptoPasswordHashType } from './framework-crypto'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { InvalidArgumentError } from '../core/application-errors/InvalidAgrumentError'
import { AppEnvConfigrationError } from '../core/application-errors/AppEnvConfigrationError'
import { ICryptoService } from './ICryptoService'

@SingletonService(CryptoServiceTkn)
export class CryptoService implements ICryptoService {
  private readonly algorithm = 'aes-192-cbc'

  public async decrypt (encrypted: string, scenario: TCryptoScenario): Promise<string> {
    if (!encrypted) {
      return ''
    }

    const decipher = crypto.createDecipheriv(this.algorithm, this.getKey(scenario), this.getIv(scenario))

    decipher.write(encrypted, 'base64')
    return decipher.final().toString('utf8')
  }

  public async encrypt (source: string, scenario: TCryptoScenario): Promise<string> {
    if (!source) {
      return ''
    }

    const cipher = crypto.createCipheriv(this.algorithm, this.getKey(scenario), this.getIv(scenario))

    let encrypted = cipher.update(source, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    return encrypted
  }

  public hash (value: string, type: TCryptoHashType): string {
    const hash = crypto.createHash(type)
    hash.update(value)
    return hash.digest('hex')
  }

  public async hashPassword (value: string, type: TCryptoPasswordHashType = 'bcrypt'): Promise<string> {
    if (type === 'bcrypt') {
      const salt = await bcrypt.genSalt(10)
      return bcrypt.hash(value, salt)
    } else {
      throw new InvalidArgumentError(`Unsupported password hashing algorithm "${type}" provided`)
    }
  }

  public isPasswordCorrect(source: string, hashed: string, type: TCryptoPasswordHashType = 'bcrypt'): Promise<boolean> {
    if (type === 'bcrypt') {
      return new Promise((resolve, reject) => bcrypt.compare(source, hashed, (err, correct) => {
        (err) ? reject(err) : resolve(correct)
      }))
    } else {
      throw new InvalidArgumentError(`Unsupported password hashing algorithm "${type}" provided`)
    }
  }

  public generateNumberCode (length: number): string {
    let code = ''
    while (code.length < length) {
      code = crypto.randomBytes(6).readUInt32BE(0).toString()
    }

    return code.substr(0, length)
  }

  public generateRandomString (length: number): string {
    return crypto.randomBytes(length).toString('base64').substr(0, length)
  }

  private getKey (scenario: TCryptoScenario) {
    const value = process.env['CRYPTO_KEY_' + scenario]
    if (!value) {
      throw new AppEnvConfigrationError(`Crypto key for scenario ${scenario} is not defined`)
    }

    return value
  }

  private getIv (scenario: TCryptoScenario) {
    const value = process.env['CRYPTO_IV_' + scenario]
    if (!value) {
      throw new AppEnvConfigrationError(`Crypto IV for scenario ${scenario} is not defined`)
    }

    return value
  }
}
