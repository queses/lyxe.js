export default () => {
  require('./console/HelloConsoleAction')

  require('./domain/usecases/ChildTransactionalUseCase')
  require('./domain/usecases/ParentTransactionalUseCase')
  require('./domain/usecases/HelloWorldUseCase')

  require('./typeorm/TestTypeormConnection')
  require('./typeorm/ConfigurableTestSpecialistQueryRepo')
  require('./typeorm/TestSpecialistAccountRepository')
  require('./typeorm/TestSpecialistRepo')
}
