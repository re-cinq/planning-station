import { BlockJson } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
/** Read once per change and shared by every section and every proposed change, instead of once per reader. */
export declare function blocksOf(doc: Doc): BlockJson[];
