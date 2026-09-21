import { describe, it, expect } from "vitest";
import { PLAN_FRAGMENT } from "@re-cinq/planning-document";
import { docFromBlocks, toBase64 } from "@re-cinq/planning-yjs";
import { encodeStateAsUpdate, XmlText } from "yjs";

import { planSeed } from "../testing/fixtures.js";
import type {
  InboundHandler,
  OutboundPlanEvent,
  PlanTransport,
} from "./plan-events.js";
import { createPlanSession } from "./plan-session.js";

const SEED = planSeed("feature");

interface RecordingTransport extends PlanTransport {
  sent: OutboundPlanEvent[];
  deliver: InboundHandler;
}

const recordingTransport = (): RecordingTransport => {
  const handlers = new Set<InboundHandler>();
  const sent: OutboundPlanEvent[] = [];

  return {
    sent,
    send: (event) => sent.push(event),
    subscribe: (handler) => {
      handlers.add(handler);

      return () => handlers.delete(handler);
    },
    deliver: (event) => handlers.forEach((handler) => handler(event)),
  };
};

const documentEvent = () => ({
  type: "document" as const,
  meta: SEED.meta,
  state: toBase64(encodeStateAsUpdate(docFromBlocks(SEED.blocks))),
});

describe("createPlanSession", () => {
  it("starts connecting and has no plan meta before the document arrives", () => {
    expect(createPlanSession(recordingTransport()).state()).toEqual({
      status: "connecting",
      meta: null,
    });
  });

  it("becomes ready with the plan meta once the document event arrives", () => {
    const transport = recordingTransport();
    const session = createPlanSession(transport);
    transport.deliver(documentEvent());
    expect(session.state()).toMatchObject({ status: "ready", meta: SEED.meta });
  });

  it("does not send the received document back to the transport", () => {
    const transport = recordingTransport();
    createPlanSession(transport);
    transport.deliver(documentEvent());
    expect(transport.sent).toEqual([]);
  });

  it("sends a local edit to the transport as one update event", () => {
    const transport = recordingTransport();
    const { doc } = createPlanSession(transport);
    transport.deliver(documentEvent());
    doc.getXmlFragment(PLAN_FRAGMENT).insert(0, [new XmlText("hi")]);
    expect(transport.sent.map((event) => event.type)).toEqual(["update"]);
  });

  it("reports denied with the reason the transport gives", () => {
    const transport = recordingTransport();
    const session = createPlanSession(transport);
    transport.deliver({
      type: "status",
      status: "denied",
      reason: "no repo access",
    });
    expect(session.state()).toMatchObject({
      status: "denied",
      reason: "no repo access",
    });
  });
});
