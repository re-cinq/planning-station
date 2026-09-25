export function resolveFinding(blocks, findingId) {
    return blocks.map((block) => block.id === findingId && block.type === "finding"
        ? { ...block, props: { ...block.props, resolved: true } }
        : block);
}
//# sourceMappingURL=findings.js.map