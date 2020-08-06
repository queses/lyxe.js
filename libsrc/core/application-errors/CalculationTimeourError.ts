import { AppError } from './AppError'

export class CalculationTimeourError extends AppError {
  name = 'CalculationTimeourError'

  constructor (calculationDescription: string, timeoutMs: number, message?: string) {
    super(message || `Timeout of ${timeoutMs}ms exceeded while performing calculation "${calculationDescription}"`)
  }
}
