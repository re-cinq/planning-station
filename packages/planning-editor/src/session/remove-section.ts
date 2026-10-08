import { applyOpsToDoc } from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

/** Written into the live doc the way an accepted change is: y-sync brings it into the editor past the template guard, which keeps people from deleting a heading by hand. */
export function removeSection(doc: Doc, slot: string): void {
  applyOpsToDoc(doc, [{ op: "remove-section", slot }]);
}
