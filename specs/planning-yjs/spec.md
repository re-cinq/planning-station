# Plan Yjs bridge

| Field   | Value                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Status  | Shipped                                                                                                                  |
| Package | `@re-cinq/planning-yjs`                                                                                                  |
| Depends | [Plan document contract](../planning-document/spec.md), [ADR-002](../../adrs/ADR-002-yjs-is-truth-json-is-projection.md) |

The Yjs bridge reads and writes the contract's blocks in a Yjs document without a browser, so servers and agents work on the same live plan the editor does.

## Schema

- The headless schema registers exactly the contract's prose and plan block kinds, the same set the editor uses ([validated by](../../packages/planning-yjs/src/schema/headless-schema.test.ts#L10)).

## Documents

- Blocks seeded into a Yjs document read back as the same sections and KPIs, with the same block ids ([validated by](../../packages/planning-yjs/src/convert/plan-doc.test.ts#L33), [validated by](../../packages/planning-yjs/src/convert/plan-doc.test.ts#L45)).
- A document that received another's state as an update reads back the same plan ([validated by](../../packages/planning-yjs/src/convert/plan-doc.test.ts#L39)).
- Seeding a document that already holds a plan throws SeededDocError ([validated by](../../packages/planning-yjs/src/convert/plan-doc.test.ts#L53)).

## Agent writes

- The agent's ops reach the live document: a paragraph it writes and a KPI it adds are in the plan afterwards ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L67), [validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L73)).
- Rich prose the agent writes in `plan.md` (nested lists, checklists, marks, links, quotes, code and tables) reaches the live document as the editor's own blocks and reads back as the same `plan.md` ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L112)).
- The whole write travels to everyone else as Yjs updates, like any other edit ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L79)).
- Only the blocks that changed are rewritten, so the rest of the document, including what a person is writing elsewhere, is left alone ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L87), [validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L98)).
- A KPI the agent writes again is revised in place instead of added twice ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L105)).
- A write costs time in proportion to the plan: each run of changed blocks between two unchanged ones is written as ONE insert, however long the run — an insert per block walks the child list every time, and 40 000 paragraphs took 19 s that way ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L121)).
- A block that moves ends up once, where the new plan holds it ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L131)).
- Writing to a document that holds no plan throws UnseededDocError ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L141)).

## Refine proposals

- A person's ask and the agent's proposal live in the document beside the plan's blocks, so every client sees them and the plan itself stays unchanged until someone accepts ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L71), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L78)).
- One pass proposes for the section a person asked about and for every other section its settled answers forced, each against that section as it stands, so every change is reviewed where it lands ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L167)).
- A section whose proposal someone is already reviewing is left alone by a later pass, and reported as skipped rather than replaced ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L191)).
- A proposal that reaches outside its section is refused with ProposalScopeError ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L91)).
- Accepting writes the proposal into its section, marks the inputs it used, and clears it; discarding clears it and leaves the section alone ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L104), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L113), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L145)).
- A proposal can be applied anyway, running its ops onto the section as it stands, so what was written meanwhile survives beside it ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L129)).
- A proposal whose section changed after the ask is refused with SectionChangedError, and one the agent has not answered yet with NoProposalError ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L121), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L154)).

## Changes, one paragraph at a time

- A pass's answer is cut into one change per paragraph it touched, each waiting beside the plan: the plan reads as it did until someone takes one ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L72)).
- A pass answers the ask a person made, even when it changed nothing there, so the plan never says a refine is still coming after it arrived ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L82)).
- A change is accepted on its own, and the ones beside it keep waiting ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L99)).
- Each change is held against the paragraph it is about, not against the section: one paragraph moving on leaves every other change acceptable, and the ones that moved on are named ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L110), [validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L120), [validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L150)).
- A change whose paragraph moved on can still be applied anyway, onto the paragraph as it stands ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L130)).
- A discarded change leaves the plan as it was ([validated by](../../packages/planning-yjs/src/refine/changes.test.ts#L139)).

## Wire format

- Yjs updates travel as base64 text, and every byte value survives the round trip ([validated by](../../packages/planning-yjs/src/wire/base64.test.ts#L6), [validated by](../../packages/planning-yjs/src/wire/base64.test.ts#L12)).
