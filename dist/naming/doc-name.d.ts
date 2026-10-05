export declare const PLAN_FRAGMENT = "document-store";
export declare class DocNameError extends Error {
}
export interface ParsedDocName {
    repo: string;
    planId: string;
}
export declare function docName(parts: ParsedDocName): string;
export declare function parseDocName(name: string): ParsedDocName;
//# sourceMappingURL=doc-name.d.ts.map