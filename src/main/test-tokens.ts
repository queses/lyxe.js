import { IChildTransactionalUseCase, IHelloWorldUseCase, IParentTransactionalUseCase } from './domain/test-use-cases'
import Token from '../../libsrc/core/di/Token'
import { IConfigurableTestSpecialistRepo, ITestSpecialistAccountRepo, ITestSpecialistRepo } from './domain/test-repos'

export const TestSpecialistRepoTkn = new Token<ITestSpecialistRepo>()
export const ConfigurableTestSpecialistRepoTkn = new Token<IConfigurableTestSpecialistRepo>()
export const TestSpecialistAccountRepoTkn = new Token<ITestSpecialistAccountRepo>()

export const HelloWorldUseCaseTkn = new Token<IHelloWorldUseCase>()
export const ParentTransactionalUseCaseTkn = new Token<IParentTransactionalUseCase>()
export const ChildTransactionalUseCaseTkn = new Token<IChildTransactionalUseCase>()
