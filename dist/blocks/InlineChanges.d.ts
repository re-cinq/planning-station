import { ChangeHosts } from './change-hosts.js';
import { ReviewableChange } from '../session/use-plan-changes.js';
export interface InlineChangesProps {
    changes: readonly ReviewableChange[];
    /** The element the widget decoration keeps after each anchored paragraph; the card is drawn into it. */
    hosts: ChangeHosts;
}
/** Every proposed change, drawn under the paragraph it is about: a person reads the agent's new words where the old ones stand, and takes or leaves that one paragraph. */
export declare function InlineChanges({ changes, hosts }: InlineChangesProps): import("react").JSX.Element;
