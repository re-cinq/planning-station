---
id: ADR-002
title: The Yjs document is the truth; PlanDocument JSON is a projection
status: accepted
date: 2026-09-19
---

# ADR-002: The Yjs document is the truth; PlanDocument JSON is a projection

A plan has exactly one writable form, the block document, and every JSON view of it is derived and read-only.

## Context

A plan is edited by several people and the planning agent at the same time, and
it is read by the host application and the agent as JSON. Two copies would
drift.

## Decision

- `PlanDocument` is derived from the blocks by `toPlanDocument(blocks, meta)`, with sections, KPIs and the prototype as read-only views ([validated by](../packages/planning-document/src/projection/round-trip.test.ts#L40)).
- `toBlocks(plan)` is the exact inverse of the sections half of the projection, and the round trip holds in both directions ([validated by](../packages/planning-document/src/projection/round-trip.test.ts#L58), [validated by](../packages/planning-document/src/projection/round-trip.test.ts#L64)).
- The document is flat: a `section-heading` block opens a section and everything up to the next heading belongs to it ([validated by](../packages/planning-document/src/projection/partition.test.ts#L38)).
- While a plan is alive, its content lives in a Yjs document: the BlockNote fragment `document-store` (`PLAN_FRAGMENT`), from which the same blocks and ids are read back ([validated by](../packages/planning-yjs/src/convert/plan-doc.test.ts#L39), [validated by](../packages/planning-yjs/src/convert/plan-doc.test.ts#L45)).
- Blocks seed only an empty document; seeding one that already holds a plan throws `SeededDocError`, so the JSON is never written back over a live plan ([validated by](../packages/planning-yjs/src/convert/plan-doc.test.ts#L53)).
- Workflow state (status, approval, version number) is not in Yjs; the editor receives it as `meta` next to the document ([validated by](../packages/planning-editor/src/session/plan-session.test.ts#L51)).

- The agent writes through semantic, id-stable ops, so a KPI it sends twice is updated and keeps its block instead of being regenerated ([validated by](../packages/planning-document/src/ops/apply-ops.test.ts#L97), [validated by](../packages/planning-document/src/ops/apply-ops.test.ts#L132)).
- Such a write goes into the live document and replaces only the blocks that changed, so a person writing elsewhere in the plan is undisturbed ([validated by](../packages/planning-yjs/src/convert/apply-ops.test.ts#L70), [validated by](../packages/planning-yjs/src/convert/apply-ops.test.ts#L81)).

## Implementation phases

- Restoring an old version replays the stored Yjs update.
- The host owns the workflow state through `PlanStore`, so approving a plan is
  an authorised action, never a keystroke.

Each item moves under Decision, with its test links, when `@re-cinq/planning-sync`
lands.

## Consequences

- Derived views are read-only; editing happens on blocks only.
- The strong format is enforced three times: template data, the editor guard,
  and `validatePlan` at the draft and approval phases.
- A plan ends at approval. Whatever is built from it afterwards, tickets
  included, lives in the host's own systems and never writes back into the plan.
