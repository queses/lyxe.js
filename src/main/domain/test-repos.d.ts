import { TestSpecialist } from './model/TestSpecialist'
import { TestSpecialistAccount } from './model/TestSpecialistAccount'
import { TestSpecialistSearchConf } from './model/TestSpecialistSearchConf'
import { IRepository } from '../../lib/persistence/IRepository'
import { IConfigurableRepository } from '../../lib/persistence/IConfigurableRepository'
import { TPagePromise } from '../../lib/persistence/lyxe-persistence'

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
