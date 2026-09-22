import { describe, it, expect } from "vitest";
import {
  SLOTS,
  TEMPLATES,
  sectionSlotFor,
  templateFor,
} from "@re-cinq/planning-document";

import { menuEntries } from "./menu-items.js";
import type { MenuBlock } from "./section-context.js";

const menuBlock = (
  id: string,
  type: string,
  props: Record<string, unknown> = {},
): MenuBlock => ({ id, type, props, children: [] });

const titles = (entries: ReturnType<typeof menuEntries>) =>
  entries.map((entry) => entry.title);

const offeredKinds = (slot: Parameters<typeof menuEntries>[0]) =>
  menuEntries(slot, { blocks: [], cursorId: "p" }).map(
    (entry) => entry.block.type,
  );

const EMPTY_QUESTIONS = [
  menuBlock("h-questions", "section-heading", { slot: "questions" }),
  menuBlock("p", "paragraph"),
];

const WITH_QUESTION = [
  ...EMPTY_QUESTIONS.slice(0, 1),
  menuBlock("q-1", "question", { questionId: "q-staleness" }),
  menuBlock("p", "paragraph"),
];

describe("menuEntries", () => {
  it("offers KPI in the success criteria section and not in the intent", () => {
    const offered = (slot: typeof SLOTS.kpis | typeof SLOTS.intent) =>
      titles(menuEntries(slot, { blocks: [], cursorId: "p" })).includes("KPI");
    expect([offered(SLOTS.kpis), offered(SLOTS.intent)]).toEqual([true, false]);
  });

  it("offers no section heading, panel or actions in any section, the agent's own included", () => {
    const slots = [
      ...Object.values(TEMPLATES).flatMap((template) => template.slots),
      sectionSlotFor(templateFor("feature"), "custom-rollout", "Rollout"),
    ];
    const offered = new Set(slots.flatMap(offeredKinds));
    expect(
      [
        "section-heading",
        "section-panel",
        "section-actions",
        "plan-title",
      ].filter((type) => offered.has(type)),
    ).toEqual([]);
  });

  it("offers Paragraph and Question in the agent's Rollout section", () => {
    const offered = titles(
      menuEntries(
        sectionSlotFor(templateFor("feature"), "custom-rollout", "Rollout"),
        { blocks: [], cursorId: "p" },
      ),
    );
    expect([
      offered.includes("Paragraph"),
      offered.includes("Question"),
    ]).toEqual([true, true]);
  });

  it("offers Question but no Answer before the first question", () => {
    const offered = titles(
      menuEntries(SLOTS.questions, { blocks: EMPTY_QUESTIONS, cursorId: "p" }),
    );
    expect([offered.includes("Question"), offered.includes("Answer")]).toEqual([
      true,
      false,
    ]);
  });

  it("attaches an answer to question q-staleness above the cursor", () => {
    const answer = menuEntries(SLOTS.questions, {
      blocks: WITH_QUESTION,
      cursorId: "p",
    }).find((entry) => entry.title === "Answer");
    expect(answer?.block).toEqual({
      type: "answer",
      props: { questionId: "q-staleness" },
    });
  });
});
