import type { BlockJson } from "../blocks/block-json.js";
import type { Section } from "../plan/plan-document.js";
import { partitionSections } from "../projection/partition.js";
import type { PlanTemplate } from "../template/template.js";
import { isCustomSlot, newCustomSlot } from "../template/templates.js";
import {
  livePrototype,
  liveKpis,
  proseParagraphs,
  sectionTitle,
} from "./live-section.js";
import { fenceOps, type LiveEntities } from "./markdown-fences.js";
import {
  changed,
  merged,
  NO_CHANGE,
  problem,
  type MarkdownOps,
} from "./markdown-outcome.js";
import { readMarkdown, type MarkdownSection } from "./read-markdown.js";

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
    proseOps(written, existing),
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
  const { title, paragraphs } = written;

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
    changed({ op: "add-section", slot, title, after, paragraphs }),
    ...fencesOps(written, slot, reading.live),
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

function proseOps(written: MarkdownSection, existing: Section): MarkdownOps {
  const current = proseParagraphs(existing);
  const same =
    current.length === written.paragraphs.length &&
    current.every(
      (paragraph, index) => paragraph === written.paragraphs[index],
    );

  return same
    ? NO_CHANGE
    : changed({
        op: "set-section-text",
        slot: existing.slot,
        paragraphs: written.paragraphs,
      });
}
