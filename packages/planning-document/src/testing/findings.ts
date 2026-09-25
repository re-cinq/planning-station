import type { BlockJson } from "../blocks/block-json.js";

export function resolveFinding(
  blocks: readonly BlockJson[],
  findingId: string,
): BlockJson[] {
  return blocks.map((block) =>
    block.id === findingId && block.type === "finding"
      ? { ...block, props: { ...block.props, resolved: true } }
      : block,
  );
}
