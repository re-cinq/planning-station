# Plan sync server

| Field   | Value                                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| Status  | Shipped                                                                                                               |
| Package | `@re-cinq/planning-sync`                                                                                              |
| Depends | [Plan document contract](../planning-document/spec.md), [Plan Yjs bridge](../planning-yjs/spec.md)                    |
| ADRs    | [ADR-001](../../adrs/ADR-001-packages-and-ports.md), [ADR-002](../../adrs/ADR-002-yjs-is-truth-json-is-projection.md) |

The sync library is the plan's server side, registered inside the host's own hapi process: it creates plans, serves the collaboration socket, keeps every write as a version, and gates approval. Persistence is the host's, behind one `PlanStore` port.

## Plans

- A new plan starts as a draft at version 1, seeded with its template's sections, and is addressed by the document name plan:owner/repo:uuid ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L48), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L57), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L62)).
- Reading a plan answers the stored JSON projection without loading the document, and an unknown plan throws PlanNotFoundError ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L82), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L78)).

## Versions

- Every write whose content changed becomes the plan's next version; a write that changed nothing cuts none ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L82), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L88)).
- A write that changed only what lives beside the content — a Refine asked, proposed or discarded — is still stored, under the current version, so it survives the document unloading ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L95)).
- Each version keeps the plan as it was, so an older version still reads as the plan of its day ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L107)).

## Approval

- A plan is approved only when it passes validation at the approval phase; otherwise the caller is told what is still missing ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L113), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L121)).
- Approval records who approved which version, and reopening a plan takes it back to a draft with no approval ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L121), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L130)).
- The host hears of every approval through `onApproved`, after the store has it, and hears nothing of a refused one, so it can start its own work from the approved plan ([validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L139), [validated by](../../packages/planning-sync/src/core/planning-service.test.ts#L150), [validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L216)).

## Collaboration

- A connecting client is served the plan as it was stored ([validated by](../../packages/planning-sync/src/core/collab-server.test.ts#L90)).
- What one person types reaches everyone else on the same plan ([validated by](../../packages/planning-sync/src/core/collab-server.test.ts#L97)).
- What was typed is stored as the plan's next version, so the writing is never only in memory ([validated by](../../packages/planning-sync/src/core/collab-server.test.ts#L109)).
- Only the host decides who may open a plan; a connection its authenticator refuses is denied ([validated by](../../packages/planning-sync/src/core/collab-server.test.ts#L118)).

## Agent writes

- The planning agent's ops go into the live document, and what it wrote is still there for the next reader ([validated by](../../packages/planning-sync/src/core/agent-writer.test.ts#L69), [validated by](../../packages/planning-sync/src/core/agent-writer.test.ts#L79)).
- An agent write changes the plan's content only; its workflow status is left alone ([validated by](../../packages/planning-sync/src/core/agent-writer.test.ts#L90)).
- When the agent could not answer a person's Refine, the host fails it with the reason, and the next reader sees the failed refine; a failure for a section nobody asked about writes nothing ([validated by](../../packages/planning-sync/src/core/agent-writer.test.ts#L141), [validated by](../../packages/planning-sync/src/core/agent-writer.test.ts#L153)).

## Routes

- Creating a plan answers 201 with its document name, and reading one answers its sections and version ([validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L79), [validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L88)).
- Approving over the route approves the plan, and an incomplete plan is refused with 409 ([validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L116), [validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L104)).
- The versions of a plan are listed in the order they were written ([validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L128)).
- The agent's ops have their own route, which answers the plan they wrote ([validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L152)).
- Errors answer as RFC 9457 problem details: 404 for an unknown plan, 401 when the host's own check refuses the caller, 400 for a payload that is not a plan ([validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L94), [validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L136), [validated by](../../packages/planning-sync/src/hapi/routes.test.ts#L144)).

## Refine proposals

- The agent answers a person's Refine by posting a proposal for that one section; it is kept aside for someone to accept, under the name of whoever asked ([validated by](../../packages/planning-sync/src/hapi/proposal-routes.test.ts#L55)).
- A proposal that changes another section is refused with 400 ([validated by](../../packages/planning-sync/src/hapi/proposal-routes.test.ts#L74)).
- An agent edit can carry the section hash it read; it is written while the section is unchanged, and refused with 409 section-changed once someone changed it ([validated by](../../packages/planning-sync/src/hapi/proposal-routes.test.ts#L90), [validated by](../../packages/planning-sync/src/hapi/proposal-routes.test.ts#L102)).

## Store port

- The shipped in-memory store satisfies the whole PlanStore contract, which a host runs against its own database ([validated by](../../packages/planning-sync/src/memory/memory-plan-store.test.ts#L10)).
- It keeps each plan's versions apart and refuses to patch a plan nobody created ([validated by](../../packages/planning-sync/src/memory/memory-plan-store.test.ts#L20), [validated by](../../packages/planning-sync/src/memory/memory-plan-store.test.ts#L14)).
