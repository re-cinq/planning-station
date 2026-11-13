// Prefer over `if (!x) throw`: reads as a precondition and narrows via the assertion signature.
export function enforceTrue(condition, errorFactory, errorMessage) {
    if (condition) {
        return;
    }
    throw buildError(errorFactory, errorMessage);
}
function buildError(errorFactory, message) {
    return isErrorClass(errorFactory)
        ? new errorFactory(message)
        : errorFactory(message);
}
function isErrorClass(errorFactory) {
    return (errorFactory === Error ||
        errorFactory.prototype instanceof Error);
}
//# sourceMappingURL=enforce.js.map