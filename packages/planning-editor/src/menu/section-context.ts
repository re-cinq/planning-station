export interface MenuBlock {
  id: string;
  type: string;
  props: Readonly<Record<string, unknown>>;
  children: readonly MenuBlock[];
}

export function slotAt(
  blocks: readonly MenuBlock[],
  blockId: string,
): string | null {
  const [heading] = sectionUpTo(blocks, blockId);

  return heading ? String(heading.props["slot"]) : null;
}

/** The question an answer typed at this point would answer, in its section. */
export function questionAt(
  blocks: readonly MenuBlock[],
  blockId: string,
): string | null {
  const question = sectionUpTo(blocks, blockId).findLast(
    (block) => block.type === "question",
  );

  return question ? String(question.props["questionId"]) : null;
}

function sectionUpTo(
  blocks: readonly MenuBlock[],
  blockId: string,
): MenuBlock[] {
  const upTo = blocks.slice(0, topLevelIndex(blocks, blockId) + 1);
  const start = upTo.findLastIndex((block) => block.type === "section-heading");

  return start < 0 ? [] : upTo.slice(start);
}

function topLevelIndex(blocks: readonly MenuBlock[], blockId: string): number {
  return blocks.findIndex((block) => contains(block, blockId));
}

function contains(block: MenuBlock, blockId: string): boolean {
  return (
    block.id === blockId ||
    block.children.some((child) => contains(child, blockId))
  );
}
