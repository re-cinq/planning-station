import { kpisOf, prototypeOf } from "./derive-views.js";
import { partitionSections, planTitle } from "./partition.js";
export function toPlanDocument(blocks, meta) {
    const sections = partitionSections(blocks);
    const everyBlock = sections.flatMap((section) => section.blocks);
    return {
        ...meta,
        title: planTitle(blocks) || meta.title,
        sections,
        kpis: kpisOf(everyBlock),
        prototype: prototypeOf(everyBlock),
    };
}
//# sourceMappingURL=to-plan-document.js.map