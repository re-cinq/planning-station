# Plan editor

| Field   | Value                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Status  | Shipped                                                                                                                  |
| Package | `@re-cinq/planning-editor`                                                                                               |
| Depends | [Plan document contract](../planning-document/spec.md), [ADR-002](../../adrs/ADR-002-yjs-is-truth-json-is-projection.md) |

The plan editor is the React component people write a plan in: the feature's name as its title, a section per template slot, and under each section the agent's questions, the comments and a Refine button for that section alone.

## Schema

- The editor registers exactly the contract's prose and plan block kinds, so anything a user writes projects without loss ([validated by](../../packages/planning-editor/src/schema/plan-schema.test.ts#L10)).
- Headings in the editor are level 2 or 3, defaulting to 2, matching what the contract accepts ([validated by](../../packages/planning-editor/src/schema/plan-schema.test.ts#L16)).
- Blocks that went through BlockNote project to the same sections and KPIs as the blocks the host passed in ([validated by](../../packages/planning-editor/src/schema/block-bridge.test.ts#L22)).
- An empty plan starts from BlockNote's own empty paragraph instead of an empty block list ([validated by](../../packages/planning-editor/src/schema/block-bridge.test.ts#L36)).

## The shape of a plan

- The feature's name is the plan's only level 1 heading, and every section heading sits under it at level 2 ([validated by](../../packages/planning-editor/src/blocks/PlanTitleView.test.tsx#L19), [validated by](../../packages/planning-editor/src/blocks/PlanTitleView.test.tsx#L33)).
- Editing that heading renames the plan, so the name is changed where it is read ([validated by](../../packages/planning-editor/src/blocks/PlanTitleView.test.tsx#L26)).
- Everything between two section headings is the section's own ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L123)).
- A section the planning agent added renders under the title its heading carries, with a hint saying the agent added it ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L148)).

## Under each section

- Every section carries its own panel in the margin: a comment box ([validated by](../../packages/planning-editor/src/blocks/SectionPanel.test.tsx#L39)).
- A comment lands in the section it was written under, carrying who said it ([validated by](../../packages/planning-editor/src/blocks/SectionPanel.test.tsx#L46)).
- A reply goes last in the thread it answers, carrying the id of the thread's first comment ([validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L50)).
- Resolving a thread marks its first comment resolved and folds its replies away, and reopening it shows them again ([validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L64), [validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L75)).
- Anyone editing can delete a comment, asked first in a popup; confirming removes a reply alone, or a thread's first comment with every reply, and cancelling keeps it ([validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L84), [validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L97), [validated by](../../packages/planning-editor/src/blocks/CommentView.test.tsx#L107)).
- When the host offers one, every section closes with a Refine button, under its questions ([validated by](../../packages/planning-editor/src/blocks/SectionActions.test.tsx#L44), [validated by](../../packages/planning-editor/src/blocks/SectionActions.test.tsx#L55)).
- Refine names one section, so the host asks its agent to work on that section alone ([validated by](../../packages/planning-editor/src/blocks/SectionActions.test.tsx#L31)).
- Refine is offered only once the section has something settled, and says what it will use: its answered questions and resolved threads ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L88), [validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L99)).
- The host receives those inputs, the ids a proposal should report as used, and the section hash it was asked against ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L106)).
- While the agent works, everyone on the plan sees who asked; if the host fails, the ask is withdrawn ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L127), [validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L135)).
- When the agent could not refine the section, the section says so and why, and offers to ask again — whatever is settled by then — or to dismiss it ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L195), [validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L203), [validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L217)).
- The agent's answer is a proposal, shown as added and removed lines until someone accepts it; accepting writes it into the section and marks the inputs it used ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L145), [validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L153)).
- Each suggested answer is offered whole, however it is punctuated ([validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L113)).
- A proposal for a section that changed after the ask cannot be accepted, only asked for again ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L180)).
- Such a proposal can still be applied anyway, onto the section as it stands, by a person who would rather have the answer than the words it was written against ([validated by](../../packages/planning-editor/src/blocks/RefineControls.test.tsx#L162)).
- The agent's question shows why it is asking, and offers each suggested answer as one click ([validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L41), [validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L48)).
- Choosing a suggestion answers the question in place, under the question it answers, and the suggestions go away so it is answered once ([validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L61), [validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L55)).
- A question without suggestions asks for a written answer, and sending one answers the question in place ([validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L145), [validated by](../../packages/planning-editor/src/blocks/QuestionView.test.tsx#L129)).

## A change under its paragraph

- The agent's answer is read where it lands: each proposed change is drawn under the paragraph it is about, showing the words it would put there and not repeating the ones already above it ([validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L73)).
- A change about no paragraph of its own — a question the agent asks — hangs at the end of its section, before the section's own actions, and reads as its question ([validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L90)).
- Only a change that drops a paragraph says the paragraph goes; a change that rewrites a section with nothing warns that the section is cleared; any other change reads as its words ([validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L90), [validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L107)).
- Accepting writes that one paragraph and leaves the rest of the plan alone ([validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L120)).
- Discarding takes the card away and leaves the paragraph as it was ([validated by](../../packages/planning-editor/src/blocks/InlineChanges.test.tsx#L129)).

## Template guard

- People never change a plan's structure: only the planning agent adds or renames sections. A section heading is a block without content, its title a prop no one types into ([validated by](../../packages/planning-document/src/blocks/plan-blocks.test.ts#L49)).
- A user cannot delete a section heading or add a second one; the template's sections stay in place ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L35), [validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L49)).
- A user cannot delete a section's panel or its actions either, so every section keeps its tools ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L69), [validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L75)).
- A user cannot move a section heading; a heading taken out and put back elsewhere is refused ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L83)).
- The side menu offers no add or drag handle on the title, a section heading, its panel or its actions, so nothing in the plan's skeleton can be dragged or deleted from it ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L173)).
- Only the title may sit above the first section heading; a block placed between them is refused, so the plan always projects ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L59)).
- A user can delete any ordinary block inside a section ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L41)).
- The host can change the section headings by marking its transaction with bypassTemplate and a reason ([validated by](../../packages/planning-editor/src/template/template-guard.test.ts#L96)).

## Editing

- The editor shows every section of the plan's template in order, each with its hint for the author ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L109), [validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L116)).
- Typing hands the host a projected plan document with the new text in its section ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L123)).
- A read-only editor cannot be edited ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L133)).
- A block's add and drag buttons sit level with the middle of its first line of text, however much spacing the block opens with ([validated by](../../packages/planning-editor/src/menu/PlanSideMenu.test.tsx#L16), [validated by](../../packages/planning-editor/src/menu/PlanSideMenu.test.tsx#L24)).
- A block with no line of text keeps its add and drag buttons at its top edge ([validated by](../../packages/planning-editor/src/menu/PlanSideMenu.test.tsx#L32)).

## Collaboration

- The editor talks to the outside only through the host's PlanTransport; it waits in a connecting state until the whole document arrives as one document event with the plan meta ([validated by](../../packages/planning-editor/src/session/plan-session.test.ts#L44), [validated by](../../packages/planning-editor/src/session/plan-session.test.ts#L51)).
- Every local edit goes out as an update event as it happens, and what came in from the transport is never sent back ([validated by](../../packages/planning-editor/src/session/plan-session.test.ts#L65), [validated by](../../packages/planning-editor/src/session/plan-session.test.ts#L58)).
- A transport that refuses the connection shows the author its reason ([validated by](../../packages/planning-editor/src/session/plan-session.test.ts#L73)).
- Two people on one plan see each other's words as they type ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L227)).
- The in-memory hub seeds its document from the plan's blocks, greets each new peer with the document and meta, relays each update to the other peers only, and stops delivering after unsubscribe ([validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L30), [validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L36), [validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L42), [validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L54), [validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L60), [validated by](../../packages/planning-editor/src/session/memory-hub.test.ts#L71)).

## Reference transport

- The reference transport hands the editor the whole document with its plan meta as soon as its provider has synced, including to a subscriber that arrives later ([validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L56), [validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L63)).
- A change from the server is passed on as an update event, and what the editor sent is never echoed back to it ([validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L69), [validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L76)).
- The editor's edits and cursor are applied to the provider, which is what shares them with everyone else ([validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L83), [validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L90)).
- A refused or dropped connection reaches the editor as a status the author can read ([validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L97), [validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L106)).
- Destroying the transport destroys its provider, so a closed page leaves no socket behind ([validated by](../../packages/planning-editor/src/transports/plan-provider.test.ts#L113)).

## Presence

- The participants list, at the top of the sidebar above the outline, names everyone else on the plan with the section they are editing, and never the viewer ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L234), [validated by](../../packages/planning-editor/src/presence/presence-users.test.ts#L20)).
- A viewer alone on the plan gets no participants list at all, not an empty one ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L240)).
- A peer that has not announced a name is not listed, and one without a cursor yet is listed with no section ([validated by](../../packages/planning-editor/src/presence/presence-users.test.ts#L43), [validated by](../../packages/planning-editor/src/presence/presence-users.test.ts#L47)).
- A participant whose cursor is in the document is a button, and one who has not placed a cursor is plain text ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L247), [validated by](../../packages/planning-editor/src/presence/presence-users.test.ts#L36)).
- Clicking a participant scrolls their cursor into view without moving the reader's own caret ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L258)).
- A peer editing a section the agent added is listed with that section's own title, the same as a template section ([validated by](../../packages/planning-editor/src/presence/presence-users.test.ts#L65)).
- Each remote cursor is drawn in the editor, labelled with its owner's name ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L273)).

## Plan blocks

- A plan block shows its props as labelled fields next to its text: a KPI's metric, baseline, target, direction and deadline ([validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L35)).
- Changing a field updates the block, and the host receives the changed KPI or prototype; a prototype's maturity is picked from its steps in order ([validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L40), [validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L46)).
- A prototype with a link offers a way out to it, in a new tab ([validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L52)).
- A read-only plan shows its fields, but nobody can change them ([validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L59)).
- A mockup renders only through the host's renderMockup adapter, never as raw markup injected by the editor ([validated by](../../packages/planning-editor/src/blocks/PlanBlockView.test.tsx#L64)).
- A finding a validation pass raised shows as a card that stands apart from a comment, labelled `Finding · <severity>` with its text and why; anyone editing resolves it, which marks the block resolved and folds the card to one line, or reopens it ([validated by](../../packages/planning-editor/src/blocks/FindingView.test.tsx#L25)).

## Slash menu

- Typing / offers only the blocks the current section allows, and choosing one inserts it ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L140), [validated by](../../packages/planning-editor/src/menu/menu-items.test.ts#L38)).
- A section the agent added gets the slash menu of prose and questions ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L164), [validated by](../../packages/planning-editor/src/menu/menu-items.test.ts#L60)).
- No section, the agent's own included, offers a section heading, a panel, actions or a title, so the menu cannot add structure ([validated by](../../packages/planning-editor/src/menu/menu-items.test.ts#L44)).
- The section is the one whose heading precedes the cursor, including inside nested list items ([validated by](../../packages/planning-editor/src/menu/section-context.test.ts#L27), [validated by](../../packages/planning-editor/src/menu/section-context.test.ts#L31), [validated by](../../packages/planning-editor/src/menu/section-context.test.ts#L35)).
- An answer attaches to the nearest question above the cursor in the same section, and is offered only once there is one ([validated by](../../packages/planning-editor/src/menu/menu-items.test.ts#L73), [validated by](../../packages/planning-editor/src/menu/menu-items.test.ts#L83), [validated by](../../packages/planning-editor/src/menu/section-context.test.ts#L41), [validated by](../../packages/planning-editor/src/menu/section-context.test.ts#L45)).

## Outline

- The outline lists every section, marks the ones required at the chosen phase, and shows each section's problems under it ([validated by](../../packages/planning-editor/src/outline/TemplateOutline.test.tsx#L12), [validated by](../../packages/planning-editor/src/outline/problems-by-slot.test.ts#L13), [validated by](../../packages/planning-editor/src/outline/problems-by-slot.test.ts#L18)).
- The outline follows the plan's sections in document order, the agent's own included, and never marks a section the agent added as required ([validated by](../../packages/planning-editor/src/outline/TemplateOutline.test.tsx#L67), [validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L155)).
- The outline says whether the plan is ready for the phase ([validated by](../../packages/planning-editor/src/outline/TemplateOutline.test.tsx#L38)).
- Once the plan is approved, the outline says who approved it and on which day instead ([validated by](../../packages/planning-editor/src/outline/TemplateOutline.test.tsx#L48), [validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L194)).
- A host can draw its own action under the outline's sections, such as the approve button the outline gates ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L181)).
- The editor hands every validation report to the host's onValidation, at the approval phase unless told otherwise ([validated by](../../packages/planning-editor/src/PlanEditor.test.tsx#L215)).

## Version diff

- A reader sees what a version added, under the title of the section it belongs to, and which two versions are being compared ([validated by](../../packages/planning-editor/src/diff/PlanDiffView.test.tsx#L25), [validated by](../../packages/planning-editor/src/diff/PlanDiffView.test.tsx#L33), [validated by](../../packages/planning-editor/src/diff/PlanDiffView.test.tsx#L41)).
- Two versions that read the same say so, instead of showing an empty diff ([validated by](../../packages/planning-editor/src/diff/PlanDiffView.test.tsx#L50)).

## Testing surface

- PlanEditorStub renders a plan's sections and text statically, for host tests that do not run a browser ([validated by](../../packages/planning-editor/src/testing/PlanEditorStub.test.tsx#L8)).
