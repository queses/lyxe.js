import { DomainError } from './DomainError'
import { IHasId } from '../../persistence/IHasId'
import { TPersistenceId } from '../../persistence/luxe-persistence'
import { EntityValidationErrorInfo } from '../../persistence/EntityValidationErrorInfo'

export class DomainEntityValidationError <E extends IHasId<ID>, ID extends TPersistenceId> extends DomainError {
  name = 'DomainEntityValidationError'

  errors: EntityValidationErrorInfo[]
  entity?: E

  constructor (errors: EntityValidationErrorInfo | EntityValidationErrorInfo[], entity?: E) {
    super('Entity has validation errors: ' + EntityValidationErrorInfo.concatMessages(errors))
    this.errors = Array.isArray(errors) ? errors : [ errors ]
    this.entity = entity
  }
}
