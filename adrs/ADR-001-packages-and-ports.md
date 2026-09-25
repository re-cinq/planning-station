---
id: ADR-001
title: Four packages in one repo, persistence and transport behind ports
status: accepted
date: 2026-09-19
---

# ADR-001: Four packages in one repo, persistence and transport behind ports

The planning feature ships as published `@re-cinq/*` packages from this repo, with the host application owning persistence and transport through two ports.

## Context

A host application's web UI is often built and deployed on its own, outside the
monorepo that holds its API. Such a UI cannot import a shared library except
through a published package; hand-mirroring modules behind parity tests is the
usual workaround, and it rots.

The planning feature has three consumers with different dependency envelopes:
an agent runner and the host's API need the plan contract with no React; the
browser needs React, BlockNote and CSS; the API needs a Yjs server that runs
inside its existing process.

## Decision

| Package                      | Depends on                      | Holds                                                |
| ---------------------------- | ------------------------------- | ---------------------------------------------------- |
| `@re-cinq/planning-document` | zod                             | the JSON contract, templates, projection, validation |
| `@re-cinq/planning-yjs`      | document, BlockNote headless    | Yjs to `PlanDocument` bridge, agent ops              |
| `@re-cinq/planning-editor`   | document, yjs, React, BlockNote | the `PlanEditor` component                           |
| `@re-cinq/planning-sync`     | document, yjs, Hocuspocus       | server core, `./hapi` adapter                        |

- `@re-cinq/planning-document` exports the whole contract from one module: projection, validation, naming and schemas ([validated by](../packages/planning-document/src/index.test.ts#L6)).
- `@re-cinq/planning-yjs` reads and seeds plans in a Yjs document in plain Node, with no browser or editor, so an API and an agent runner can use it ([validated by](../packages/planning-yjs/src/convert/plan-doc.test.ts#L33), [validated by](../packages/planning-yjs/src/schema/headless-schema.test.ts#L10)).
- `PlanTransport` (`send` + `subscribe`) is the editor's only connection to the outside, and the whole document arrives as one `document` event with the plan meta ([validated by](../packages/planning-editor/src/session/plan-session.test.ts#L51), [validated by](../packages/planning-editor/src/session/memory-hub.test.ts#L30)).
- The editor package ships an in-memory hub that relays updates between the peers on one page, for tests and the proof of concept ([validated by](../packages/planning-editor/src/session/memory-hub.test.ts#L42)).
- The editor package ships a transport that wraps one `HocuspocusProvider`, and nothing else in the editor knows a network exists ([validated by](../packages/planning-editor/src/transports/plan-provider.test.ts#L56)).
- `PlanStore` is the one persistence port: the sync package ships an in-memory store, and a host's own store is checked against the same contract ([validated by](../packages/planning-sync/src/memory/memory-plan-store.test.ts#L10)).
- `@re-cinq/planning-sync` registers its routes and its collaboration socket on the host's own hapi server, so the host keeps one process and one port ([validated by](../packages/planning-sync/src/hapi/routes.test.ts#L79), [validated by](../packages/planning-sync/src/core/collab-server.test.ts#L97)).
- The host decides who may open a plan, through the `CollabAuthenticator` port; the library verifies no tokens itself ([validated by](../packages/planning-sync/src/core/collab-server.test.ts#L118)).

## Implementation phases

- Each package is published from this repo under a tag prefix of its own.
- A host application implements `PlanStore` on its own database, with its own
  migrations.
- `apps/poc` runs everything with the in-memory store and no database. It is a
  proof of concept, not a deployable service.

Each item moves under Decision, with its test links, when its package lands.

## Consequences

- One version train and in-process tests across the contract, the bridge, the
  editor and the server.
- `yjs` is a peer dependency everywhere so the browser holds one Yjs instance.
- The contract package may not import React, Yjs, BlockNote, Hocuspocus or hapi;
  `re-lint/no-forbidden-imports` enforces each package's envelope.
- Publishing several packages from one repo means one release tag prefix per
  package, and a version check that refuses a tag the package disagrees with.
