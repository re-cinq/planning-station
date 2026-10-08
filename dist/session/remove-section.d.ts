import { Doc } from 'yjs';
/** Written into the live doc the way an accepted change is: y-sync brings it into the editor past the template guard, which keeps people from deleting a heading by hand. */
export declare function removeSection(doc: Doc, slot: string): void;
