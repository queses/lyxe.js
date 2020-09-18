export const Conditional = <A extends (...args: any) => any> (condition: () => boolean, annotation: A) => {
  if (condition()) {
    return annotation
  } else {
    return () => {}
  }
}
