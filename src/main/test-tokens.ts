import { IChildTransactionalUseCase, IHelloWorldUseCase, IParentTransactionalUseCase } from './domain/test-use-cases'
import { IConfigurableTestSpecialistRepo, ITestSpecialistAccountRepo, ITestSpecialistRepo } from './domain/test-repos'
import Token from '../lib/core/di/Token'

export const TestSpecialistRepoTkn = new Token<ITestSpecialistRepo>()
export const ConfigurableTestSpecialistRepoTkn = new Token<IConfigurableTestSpecialistRepo>()
export const TestSpecialistAccountRepoTkn = new Token<ITestSpecialistAccountRepo>()

export const HelloWorldUseCaseTkn = new Token<IHelloWorldUseCase>()
export const ParentTransactionalUseCaseTkn = new Token<IParentTransactionalUseCase>()
export const ChildTransactionalUseCaseTkn = new Token<IChildTransactionalUseCase>()
