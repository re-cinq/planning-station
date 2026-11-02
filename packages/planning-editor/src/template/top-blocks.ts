import type { Node } from "prosemirror-model";

export const SECTION_HEADING = "section-heading";

/** A block of the plan's top level: where its container starts, the container, and the content inside it that says what kind of block it is. */
export interface TopBlock {
  pos: number;
  node: Node;
  content: Node | null;
  type: string;
}

/** The plan's blocks in order, as the sections hold them: nested children ride inside their parent. */
export function topBlocks(doc: Node): TopBlock[] {
  const blocks: TopBlock[] = [];
  doc.firstChild?.forEach((node, offset) => {
    const content = node.firstChild;
    blocks.push({
      pos: offset + 1,
      node,
      content,
      type: content?.type.name ?? "",
    });
  });

  return blocks;
}
