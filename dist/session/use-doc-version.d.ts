import { Doc } from 'yjs';
/** Changes on every update of the document, so a reader of it recomputes. */
export declare function useDocVersion(doc: Doc): number;
