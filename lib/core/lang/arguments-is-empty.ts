export const argumentsIsEmpty = (args: IArguments) => {
  for (const argValue of args) {
    if (argValue !== undefined) {
      return false
    }
  }

  return true
}
