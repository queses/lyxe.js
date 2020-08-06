import { IRepository } from '../../../libsrc/persistence/IRepository'
import { TestSpecialist } from './model/TestSpecialist'
import { IConfigurableRepository } from '../../../libsrc/persistence/IConfigurableRepository'
import { TestSpecialistAccount } from './model/TestSpecialistAccount'
import { TestSpecialistSearchConf } from './model/TestSpecialistSearchConf'
import { TPagePromise } from '../../../libsrc/persistence/luxie-persistence'

export interface ITestSpecialistRepo extends IRepository<TestSpecialist, number> {
  findByFirstName (needle: string): Promise<TestSpecialist[]>
  findWhereFirstNameLike (needle: string): Promise<TestSpecialist[]>
  findWhereLastNameLike (needle: string): Promise<TestSpecialist[]>
}

export interface IConfigurableTestSpecialistRepo extends IConfigurableRepository<TestSpecialist, number, TestSpecialistSearchConf> {
  findWhereFirstNameLike (needle: string, opts?: TestSpecialistSearchConf): TPagePromise<TestSpecialist>
  countWhereLastNameStartsWith (needle: string, opts: TestSpecialistSearchConf): Promise<number>
}

export interface ITestSpecialistAccountRepo extends IRepository<TestSpecialistAccount, number> {}
