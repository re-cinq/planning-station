export type ErrorFactory = ((message: string) => Error) | (new (message: string) => Error);
export declare function enforceTrue(condition: unknown, errorFactory: ErrorFactory, errorMessage: string): asserts condition;
//# sourceMappingURL=enforce.d.ts.map