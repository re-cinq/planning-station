import type { BlockJson } from "../blocks/block-json.js";
import type { Section } from "../plan/plan-document.js";
import { partitionSections } from "../projection/partition.js";
import type { PlanTemplate, SectionSlot } from "../template/template.js";
import {
  isCustomSlot,
  newCustomSlot,
  findSectionSlot,
} from "../template/templates.js";
import { toProseBlocks } from "../ops/prose-input.js";
import {
  livePrototype,
  liveKpis,
  liveProse,
  sectionTitle,
} from "./live-section.js";
import { judgeProse, type JudgedProse } from "./allowed-prose.js";
import { fenceOps, type LiveEntities } from "./markdown-fences.js";
import {
  changed,
  merged,
  NO_CHANGE,
  problem,
  type MarkdownOps,
} from "./markdown-outcome.js";
import { readMarkdown, type MarkdownSection } from "./read-markdown.js";
import { proseDiffOps } from "./prose-diff.js";
import { writeProse } from "./write-prose.js";

interface LivePlan extends LiveEntities {
  sections: ReadonlyMap<string, Section>;
  template: PlanTemplate;
}

/** The plan read against, and how far the walk through plan.md has got: the section a new one goes after, and those already read. */
interface Reading {
  live: LivePlan;
  after: string;
  seen: Set<string>;
}

/** Only what the agent changed becomes an op; a section left out of the file is left alone. */
export function markdownToOps(
  markdown: string,
  blocks: readonly BlockJson[],
  template: PlanTemplate,
): MarkdownOps {
  const sections = partitionSections(blocks);
  const reading: Reading = {
    live: livePlan(blocks, sections, template),
    after: sections.at(-1)?.slot ?? "",
    seen: new Set(),
  };

  return merged(
    readMarkdown(markdown).map((written) => sectionOps(written, reading)),
  );
}

function livePlan(
  blocks: readonly BlockJson[],
  sections: readonly Section[],
  template: PlanTemplate,
): LivePlan {
  return {
    sections: new Map(sections.map((section) => [section.slot, section])),
    template,
    kpis: liveKpis(blocks),
    prototype: livePrototype(blocks),
  };
}

function sectionOps(written: MarkdownSection, reading: Reading): MarkdownOps {
  return written.slot === null
    ? newSectionOps(written, reading)
    : markedSectionOps(written, written.slot, reading);
}

function markedSectionOps(
  written: MarkdownSection,
  slot: string,
  reading: Reading,
): MarkdownOps {
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
    proseOps(written, existing, slotOf(live, slot, written)),
    ...fencesOps(written, slot, live),
  ]);
}

function visit(reading: Reading, slot: string): void {
  reading.seen.add(slot);
  reading.after = slot;
}

function newSectionOps(
  written: MarkdownSection,
  reading: Reading,
): MarkdownOps {
  const { title } = written;

  if (title === "") {
    return problem(
      "untitled-section",
      reading.after,
      "a section needs a title",
    );
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
function newSectionContent(
  written: MarkdownSection,
  slot: string,
  live: LivePlan,
): MarkdownOps {
  const judged = judgeProse(slotOf(live, slot, written), [], written.prose);

  return merged([
    insertedProse(slot, judged),
    ...fencesOps(written, slot, live),
  ]);
}

function fencesOps(
  written: MarkdownSection,
  slot: string,
  live: LivePlan,
): MarkdownOps[] {
  return written.fences.map((fence) => fenceOps(fence, slot, live));
}

function titleOps(
  written: MarkdownSection,
  existing: Section,
  template: PlanTemplate,
): MarkdownOps {
  const current = sectionTitle(existing, template);

  if (written.title === current) {
    return NO_CHANGE;
  }

  return isCustomSlot(existing.slot)
    ? retitled(existing.slot, written.title)
    : problem(
        "renamed-template-section",
        existing.slot,
        `"${current}" belongs to the template and keeps its title`,
      );
}

function retitled(slot: string, title: string): MarkdownOps {
  return title === ""
    ? problem("untitled-section", slot, "a section needs a title")
    : changed({ op: "set-section-title", slot, title });
}

/** Prose is compared as the canonical Markdown both sides write, so a section written back as it was is no change. */
function proseOps(
  written: MarkdownSection,
  existing: Section,
  sectionSlot: SectionSlot | undefined,
): MarkdownOps {
  const { slot } = existing;
  const judged = judgeProse(sectionSlot, liveProse(existing), written.prose);
  const current = writeProse(judged.live).join("\n");
  const next = writeProse(toProseBlocks(slot, judged.written)).join("\n");
  const ops =
    current === next ? [] : proseDiffOps(slot, judged.live, judged.written);

  return { ops, problems: judged.problems };
}

/** The slot a section of the file is written into, under the title the file gives it; none for a slot its template has lost. */
function slotOf(
  live: LivePlan,
  slot: string,
  written: MarkdownSection,
): SectionSlot | undefined {
  return findSectionSlot(live.template, slot, written.title);
}

/** A section the file just added holds nothing yet, so all of its prose is an insert. */
function insertedProse(slot: string, judged: JudgedProse): MarkdownOps {
  const { written: blocks, problems } = judged;
  const ops =
    blocks.length > 0
      ? [{ op: "insert-blocks" as const, slot, after: null, blocks }]
      : [];

  return { ops, problems };
}
