import { partitionSections } from "../projection/partition.js";
import { isCustomSlot, newCustomSlot } from "../template/templates.js";
import { toProseBlocks } from "../ops/prose-input.js";
import { livePrototype, liveKpis, liveProse, sectionTitle, } from "./live-section.js";
import { fenceOps } from "./markdown-fences.js";
import { changed, merged, NO_CHANGE, problem, } from "./markdown-outcome.js";
import { readMarkdown } from "./read-markdown.js";
import { writeProse } from "./write-prose.js";
/** Only what the agent changed becomes an op; a section left out of the file is left alone. */
export function markdownToOps(markdown, blocks, template) {
    const sections = partitionSections(blocks);
    const reading = {
        live: livePlan(blocks, sections, template),
        after: sections.at(-1)?.slot ?? "",
        seen: new Set(),
    };
    return merged(readMarkdown(markdown).map((written) => sectionOps(written, reading)));
}
function livePlan(blocks, sections, template) {
    return {
        sections: new Map(sections.map((section) => [section.slot, section])),
        template,
        kpis: liveKpis(blocks),
        prototype: livePrototype(blocks),
    };
}
function sectionOps(written, reading) {
    return written.slot === null
        ? newSectionOps(written, reading)
        : markedSectionOps(written, written.slot, reading);
}
function markedSectionOps(written, slot, reading) {
    const { live } = reading;
    const existing = live.sections.get(slot);
    if (!existing) {
        return problem("unknown-section", slot, `the plan has no section ${slot}`);
    }
    if (reading.seen.has(slot)) {
        return problem("duplicate-section", slot, `${slot} is written twice`);
    }
    visit(reading, slot);
    return merged([
        titleOps(written, existing, live.template),
        proseOps(written, existing),
        ...fencesOps(written, slot, live),
    ]);
}
function visit(reading, slot) {
    reading.seen.add(slot);
    reading.after = slot;
}
function newSectionOps(written, reading) {
    const { title } = written;
    if (title === "") {
        return problem("untitled-section", reading.after, "a section needs a title");
    }
    const slot = newCustomSlot();
    const { after } = reading;
    reading.after = slot;
    return merged([
        changed({ op: "add-section", slot, title, after, paragraphs: [] }),
        newSectionContent(written, slot, reading.live),
    ]);
}
/** A new section's prose and fences, written into it once it exists. */
function newSectionContent(written, slot, live) {
    const { prose } = written;
    return merged([
        prose.length > 0 ? proseOp(slot, prose) : NO_CHANGE,
        ...fencesOps(written, slot, live),
    ]);
}
function fencesOps(written, slot, live) {
    return written.fences.map((fence) => fenceOps(fence, slot, live));
}
function titleOps(written, existing, template) {
    const current = sectionTitle(existing, template);
    if (written.title === current) {
        return NO_CHANGE;
    }
    return isCustomSlot(existing.slot)
        ? retitled(existing.slot, written.title)
        : problem("renamed-template-section", existing.slot, `"${current}" belongs to the template and keeps its title`);
}
function retitled(slot, title) {
    return title === ""
        ? problem("untitled-section", slot, "a section needs a title")
        : changed({ op: "set-section-title", slot, title });
}
/** Prose is compared as the canonical Markdown both sides write, so a section written back as it was is no change. */
function proseOps(written, existing) {
    const { slot } = existing;
    const current = writeProse(liveProse(existing)).join("\n");
    const next = writeProse(toProseBlocks(slot, written.prose)).join("\n");
    return current === next ? NO_CHANGE : proseOp(slot, written.prose);
}
function proseOp(slot, blocks) {
    return changed({ op: "set-section-prose", slot, blocks });
}
//# sourceMappingURL=markdown-to-ops.js.map