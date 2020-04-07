import { TCryptoHashType, TCryptoPasswordHashType, TCryptoScenario } from './framework-crypto'

export interface ICryptoService {
  decrypt (encrypted: string, scenario: TCryptoScenario): Promise<string>
  encrypt (source: string, scenario: TCryptoScenario): Promise<string>
  hash (value: string, type: TCryptoHashType): string
  hashPassword (value: string, type?: TCryptoPasswordHashType): Promise<string>
  isPasswordCorrect (source: string, hashed: string, type?: TCryptoPasswordHashType): Promise<boolean>
  generateNumberCode (length: number): string
  generateRandomString (length: number): string
}
