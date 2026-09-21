import { describe, it, expect } from "vitest";
import { BlockNoteEditor } from "@blocknote/core";

import { toEditorBlocks } from "../schema/block-bridge.js";
import { planSchema } from "../schema/plan-schema.js";
import { seeded, textBlock } from "../testing/fixtures.js";
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

  it("lets the host remove the kpis heading when it bypasses the template", () => {
    const editor = guardedEditor();
    editor.transact((transaction) => {
      bypassTemplate(transaction, "restore version 3");
      editor.removeBlocks(["h-kpis"]);
    });
    expect(slotsOf(editor)).toEqual(["intent"]);
  });
});
