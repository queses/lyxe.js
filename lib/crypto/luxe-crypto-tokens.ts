import Token from '../core/di/Token'
import { ICryptoService } from './ICryptoService'

export const CryptoServiceTkn = new Token<ICryptoService>('ICryptoService')
