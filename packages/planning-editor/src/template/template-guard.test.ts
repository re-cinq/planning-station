import { describe, it, expect } from "vitest";
import { BlockNoteEditor } from "@blocknote/core";
import type { Node as PmNode } from "prosemirror-model";
import { NodeSelection } from "prosemirror-state";

import { toEditorBlocks } from "../schema/block-bridge.js";
import { planSchema } from "../schema/plan-schema.js";
import { seeded, textBlock } from "../testing/fixtures.js";
import { ignoresKeysOnSkeleton } from "./empty-section.js";
import {
  bypassTemplate,
  headingSlots,
  templateGuard,
} from "./template-guard.js";

const INTENT_TEXT = textBlock("paragraph", {}, "Checkout feels slow");

const TITLE_AND_TWO_SECTIONS = 5;

const guardedEditor = () => {
  const editor = BlockNoteEditor.create({
    schema: planSchema,
    initialContent: toEditorBlocks([
      ...seeded("refactor").slice(0, TITLE_AND_TWO_SECTIONS),
      INTENT_TEXT,
    ]),
    extensions: [templateGuard],
  });
  editor.mount(document.body.appendChild(document.createElement("div")));

  return editor;
};

const slotsOf = (editor: ReturnType<typeof guardedEditor>) =>
  headingSlots(editor.prosemirrorState.doc);

describe("templateGuard", () => {
  it("keeps the kpis heading when a user deletes it", () => {
    const editor = guardedEditor();
    editor.removeBlocks(["h-kpis"]);
    expect(slotsOf(editor)).toEqual(["intent", "kpis"]);
  });

  it("lets a user delete an ordinary paragraph", () => {
    const editor = guardedEditor();
    editor.removeBlocks([INTENT_TEXT.id]);
    expect(editor.document.map((block) => block.id)).not.toContain(
      INTENT_TEXT.id,
    );
  });

  it("refuses a second intent heading inserted by a user", () => {
    const editor = guardedEditor();
    editor.insertBlocks(
      [{ type: "section-heading", props: { slot: "intent", title: "Again" } }],
      INTENT_TEXT.id,
      "after",
    );
    expect(slotsOf(editor)).toEqual(["intent", "kpis"]);
  });

  it("refuses a paragraph placed between the title and the first heading", () => {
    const editor = guardedEditor();
    editor.insertBlocks([{ type: "paragraph" }], "h-intent", "before");
    const { document } = editor;
    expect(document.slice(0, 2).map((block) => block.type)).toEqual([
      "plan-title",
      "section-heading",
    ]);
  });

  it("keeps the intent panel when a user deletes it", () => {
    const editor = guardedEditor();
    editor.removeBlocks(["panel-intent"]);
    expect(editor.document.map((block) => block.id)).toContain("panel-intent");
  });

  it("keeps the intent actions when a user deletes them", () => {
    const editor = guardedEditor();
    editor.removeBlocks(["actions-intent"]);
    expect(editor.document.map((block) => block.id)).toContain(
      "actions-intent",
    );
  });

  it("refuses moving the kpis heading above the intent heading", () => {
    const editor = guardedEditor();
    editor.transact(() => {
      editor.removeBlocks(["h-kpis"]);
      editor.insertBlocks(
        [{ type: "section-heading", props: { slot: "kpis", title: "KPIs" } }],
        "h-intent",
        "before",
      );
    });
    expect(slotsOf(editor)).toEqual(["intent", "kpis"]);
  });

  it("lets the host remove the kpis heading when it bypasses the template", () => {
    const editor = guardedEditor();
    editor.transact((transaction) => {
      bypassTemplate(transaction, "restore version 3");
      editor.removeBlocks(["h-kpis"]);
    });
    expect(slotsOf(editor)).toEqual(["intent"]);
  });
});

const INTENT_SECTION = 4;
const STRAY = textBlock("paragraph", {}, "Under Refine");
const WRITTEN = {
  id: INTENT_TEXT.id,
  type: "paragraph",
  content: "Checkout feels slow",
} as const;

const mountedIntent = (
  extensions: (typeof templateGuard)[],
  extra: ReturnType<typeof textBlock>[],
) => {
  const editor = BlockNoteEditor.create({
    schema: planSchema,
    initialContent: toEditorBlocks([
      ...seeded("refactor").slice(0, INTENT_SECTION),
      ...extra,
    ]),
    extensions,
  });
  editor.mount(document.body.appendChild(document.createElement("div")));

  return editor;
};

const intentEditor = (extra: ReturnType<typeof textBlock>[] = []) =>
  mountedIntent([templateGuard], extra);

const TWO_SECTIONS = 7;
const MOBILE = textBlock("question", { questionId: "q1" }, "Mobile?");

const strayUnderIntentEditor = () => {
  const [title, ...skeleton] = seeded("refactor").slice(0, TWO_SECTIONS);
  const intent = skeleton.slice(0, INTENT_SECTION - 1);
  const editor = BlockNoteEditor.create({
    schema: planSchema,
    initialContent: toEditorBlocks([
      ...(title ? [title] : []),
      ...intent,
      STRAY,
      MOBILE,
      ...skeleton.slice(INTENT_SECTION - 1),
    ]),
    extensions: [templateGuard],
  });
  editor.mount(document.body.appendChild(document.createElement("div")));

  return editor;
};

const unguardedIntentEditor = () => mountedIntent([], []);

const idsOf = (editor: ReturnType<typeof intentEditor>) =>
  editor.document.map((block) => block.id);

const pressEnter = (editor: ReturnType<typeof intentEditor>) => {
  const view = editor.prosemirrorView;
  const enter = new KeyboardEvent("keydown", { key: "Enter" });
  view.someProp("handleKeyDown", (handle) => handle(view, enter));
};

const contentPos = (doc: PmNode, id: string) => {
  const found: number[] = [];
  doc.descendants((node, pos) => {
    if (node.attrs["id"] === id) {
      found.push(pos + 1);
    }

    return found.length === 0;
  });

  return found[0] ?? -1;
};

const selectNode = (editor: ReturnType<typeof intentEditor>, id: string) => {
  const view = editor.prosemirrorView;
  const { doc, tr: transaction } = view.state;
  view.dispatch(
    transaction.setSelection(NodeSelection.create(doc, contentPos(doc, id))),
  );
};

describe("templateGuard keeps a section's actions last", () => {
  it("refuses a paragraph a user inserts after the intent actions", () => {
    const editor = intentEditor();
    editor.insertBlocks([{ type: "paragraph" }], "actions-intent", "after");
    expect(idsOf(editor).at(-1)).toBe("actions-intent");
  });

  it("refuses the paragraph Enter adds after the selected intent actions", () => {
    const editor = intentEditor();
    selectNode(editor, "actions-intent");
    pressEnter(editor);
    expect(idsOf(editor).at(-1)).toBe("actions-intent");
  });

  it("sees Enter add a paragraph after the selected intent actions when nothing guards the template", () => {
    const editor = unguardedIntentEditor();
    selectNode(editor, "actions-intent");
    pressEnter(editor);
    expect(idsOf(editor).at(-1)).not.toBe("actions-intent");
  });

  it("lets a user write a paragraph before the intent actions", () => {
    const editor = intentEditor();
    editor.insertBlocks([WRITTEN], "actions-intent", "before");
    expect(idsOf(editor).slice(-2)).toEqual([INTENT_TEXT.id, "actions-intent"]);
  });

  it("lets a plan that already holds a paragraph under the intent actions be written in", () => {
    const editor = intentEditor([STRAY]);
    editor.insertBlocks([WRITTEN], "actions-intent", "before");
    expect(idsOf(editor).slice(-3)).toEqual([
      INTENT_TEXT.id,
      "actions-intent",
      STRAY.id,
    ]);
  });

  it("lets the paragraph a plan already holds under the intent actions be deleted", () => {
    const editor = intentEditor([STRAY]);
    editor.removeBlocks([STRAY.id]);
    expect(idsOf(editor).at(-1)).toBe("actions-intent");
  });

  it("lets the paragraph a plan already holds under the intent actions be typed in", () => {
    const editor = intentEditor([STRAY]);
    editor.updateBlock(STRAY.id, { content: "Under Refine, still" });
    expect(editor.getBlock(STRAY.id)?.content).toMatchObject([
      { text: "Under Refine, still" },
    ]);
  });

  it("refuses a second paragraph after the one a plan already holds under the intent actions", () => {
    const editor = intentEditor([STRAY]);
    editor.insertBlocks([{ type: "paragraph" }], STRAY.id, "after");
    expect(idsOf(editor).slice(-2)).toEqual(["actions-intent", STRAY.id]);
  });

  it("refuses moving the paragraph under the intent actions to under the kpis actions in one change", () => {
    const editor = strayUnderIntentEditor();
    editor.transact(() => {
      editor.removeBlocks([STRAY.id]);
      editor.insertBlocks([{ type: "paragraph" }], "actions-kpis", "after");
    });
    expect(idsOf(editor)).toContain(STRAY.id);
  });

  it("lets the question 'Mobile?' an old plan holds under the intent actions be answered", () => {
    const editor = strayUnderIntentEditor();
    editor.insertBlocks(
      [{ type: "answer", props: { questionId: "q1" }, content: "Yes" }],
      MOBILE.id,
      "after",
    );
    expect(editor.document.map((block) => block.type)).toContain("answer");
  });
});

const keyOn = (key: string, init: KeyboardEventInit = {}) => {
  const editor = intentEditor();
  selectNode(editor, "panel-intent");

  return ignoresKeysOnSkeleton(
    editor.prosemirrorView,
    new KeyboardEvent("keydown", { key, ...init }),
  );
};

describe("ignoresKeysOnSkeleton", () => {
  it("swallows Enter, a typed letter and a typed 😀 while the intent panel itself is selected, but not a copy", () => {
    expect({
      enter: keyOn("Enter"),
      letter: keyOn("x"),
      emoji: keyOn("😀"),
      copy: keyOn("c", { metaKey: true }),
    }).toEqual({ enter: true, letter: true, emoji: true, copy: false });
  });
});
