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

- The agent's ops reach the live document: a paragraph it writes and a KPI it adds are in the plan afterwards ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L56), [validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L62)).
- Rich prose the agent writes in `plan.md` (nested lists, checklists, marks, links, quotes, code and tables) reaches the live document as the editor's own blocks and reads back as the same `plan.md` ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L101)).
- The whole write travels to everyone else as Yjs updates, like any other edit ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L68)).
- Only the blocks that changed are rewritten, so the rest of the document, including what a person is writing elsewhere, is left alone ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L76), [validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L87)).
- A KPI the agent writes again is revised in place instead of added twice ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L94)).
- Writing to a document that holds no plan throws UnseededDocError ([validated by](../../packages/planning-yjs/src/convert/apply-ops.test.ts#L110)).

## Refine proposals

- A person's ask and the agent's proposal live in the document beside the plan's blocks, so every client sees them and the plan itself stays unchanged until someone accepts ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L68), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L75)).
- A proposal that reaches outside its section is refused with ProposalScopeError ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L88)).
- Accepting writes the proposal into its section, marks the inputs it used, and clears it; discarding clears it and leaves the section alone ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L101), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L110), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L126)).
- A proposal whose section changed after the ask is refused with SectionChangedError, and one the agent has not answered yet with NoProposalError ([validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L118), [validated by](../../packages/planning-yjs/src/refine/proposals.test.ts#L135)).

## Wire format

- Yjs updates travel as base64 text, and every byte value survives the round trip ([validated by](../../packages/planning-yjs/src/wire/base64.test.ts#L6), [validated by](../../packages/planning-yjs/src/wire/base64.test.ts#L12)).
