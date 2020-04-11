export const Conditional = <A extends Function, T> (condition: () => boolean, annotation: A) => {
  if (condition()) {
    return annotation
  } else {
    return () => {}
  }
}
