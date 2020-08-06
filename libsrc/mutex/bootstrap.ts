export default () => {
  require('./in-memory/InMemoryMutex')
  require('./redlock/RedlockSimpleMutex')
}
