// Prefer over `if (!x) throw`: reads as a precondition and narrows via the assertion signature.

export type ErrorFactory =
  ((message: string) => Error) | (new (message: string) => Error);

export function enforceTrue(
  condition: unknown,
  errorFactory: ErrorFactory,
  errorMessage: string,
): asserts condition {
  if (condition) {
    return;
  }

  throw buildError(errorFactory, errorMessage);
}

function buildError(errorFactory: ErrorFactory, message: string): Error {
  return isErrorClass(errorFactory)
    ? new errorFactory(message)
    : errorFactory(message);
}

function isErrorClass(
  errorFactory: ErrorFactory,
): errorFactory is new (message: string) => Error {
  return (
    errorFactory === Error ||
    (errorFactory as { prototype?: unknown }).prototype instanceof Error
  );
}
