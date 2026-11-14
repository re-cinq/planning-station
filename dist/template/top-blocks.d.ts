import { Node } from 'prosemirror-model';
export declare const SECTION_HEADING = "section-heading";
/** A block of the plan's top level: where its container starts, the container, and the content inside it that says what kind of block it is. */
export interface TopBlock {
    pos: number;
    node: Node;
    content: Node | null;
    type: string;
}
/** The plan's blocks in order, as the sections hold them: nested children ride inside their parent. */
export declare function topBlocks(doc: Node): TopBlock[];
