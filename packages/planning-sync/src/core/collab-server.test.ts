import { afterEach, describe, it, expect } from "vitest";
import {
  HocuspocusProvider,
  type HocuspocusProviderConfiguration,
} from "@hocuspocus/provider";
import { PLAN_FRAGMENT } from "@re-cinq/planning-document";
import { readyFeature } from "@re-cinq/planning-document/testing";
import { docFromBlocks, readBlocks } from "@re-cinq/planning-yjs";
import { XmlElement, XmlText, type Doc, type XmlFragment } from "yjs";
import WebSocket from "ws";

import { startTestServer, type TestServer } from "../testing/test-server.js";

const NEW_PLAN = {
  repo: "acme/shop",
  title: "Faster checkout",
  type: "feature" as const,
  createdBy: "octocat",
};

const DEBOUNCE_MS = 20;

let running: TestServer | undefined;
const providers: HocuspocusProvider[] = [];

const startPlan = async () => {
  running = await startTestServer({ debounce: DEBOUNCE_MS });
  const { meta, documentName } = await running.service.createPlan(NEW_PLAN);
  await running.service.storeDocument({
    planId: meta.id,
    doc: docFromBlocks(readyFeature()),
    actor: "octocat",
    reason: "publish",
  });

  return { test: running, planId: meta.id, documentName };
};

const connect = (test: TestServer, name: string, token = "ana") => {
  const provider = new HocuspocusProvider({
    url: test.wsUrl,
    name,
    token,
    WebSocketPolyfill: WebSocket,
  } as HocuspocusProviderConfiguration);
  providers.push(provider);

  return provider;
};

const synced = (provider: HocuspocusProvider) =>
  new Promise<void>((resolve) => provider.on("synced", () => resolve()));

const denied = (provider: HocuspocusProvider) =>
  new Promise<string>((resolve) =>
    provider.on("authenticationFailed", ({ reason }: { reason: string }) =>
      resolve(reason),
    ),
  );

const eventually = async (until: () => Promise<boolean> | boolean) => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await until()) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  return false;
};

const type = (doc: Doc, words: string) => {
  const text = firstTextOutsideTheTitle(doc.getXmlFragment(PLAN_FRAGMENT));
  text?.insert(0, words);
};

const intentText = (doc: Doc) =>
  readBlocks(doc)
    .filter((block) => block.type === "paragraph")
    .map((block) => JSON.stringify(block.content));

afterEach(async () => {
  providers.splice(0).forEach((provider) => provider.destroy());
  await running?.close();
  running = undefined;
});

describe("createCollabServer", () => {
  it("loads the stored plan's eight sections into a connecting client", async () => {
    const { test, documentName } = await startPlan();
    const ana = connect(test, documentName);
    await synced(ana);
    expect(readBlocks(ana.document).filter(isHeading)).toHaveLength(8);
  });

  it("sends Ana's words to Ben on the same plan", async () => {
    const { test, documentName } = await startPlan();
    const [ana, ben] = [
      connect(test, documentName, "ana"),
      connect(test, documentName, "ben"),
    ];
    await Promise.all([synced(ana), synced(ben)]);
    type(ana.document, "Slow checkout. ");
    const seen = () => intentText(ben.document).join(" ").includes("Slow");
    expect(await eventually(seen)).toBe(true);
  });

  it("stores what was typed as the plan's next version", async () => {
    const { test, planId, documentName } = await startPlan();
    const ana = connect(test, documentName);
    await synced(ana);
    type(ana.document, "Slow checkout. ");
    const stored = async () => (await test.store.listVersions(planId)).length;
    expect(await eventually(async () => (await stored()) === 3)).toBe(true);
  });

  it("refuses a connection the host's authenticator does not accept", async () => {
    const { test, documentName } = await startPlan();
    expect(await denied(connect(test, documentName, ""))).toEqual(
      "permission-denied",
    );
  });
});

function isHeading(block: { type: string }): boolean {
  return block.type === "section-heading";
}

function firstTextOutsideTheTitle(
  node: XmlFragment | XmlElement,
): XmlText | undefined {
  const children = node.toArray();

  if (node instanceof XmlElement && node.nodeName === "plan-title") {
    return undefined;
  }

  return children
    .flatMap((child) =>
      child instanceof XmlText
        ? [child]
        : [firstTextOutsideTheTitle(child as XmlElement)],
    )
    .find(Boolean);
}
