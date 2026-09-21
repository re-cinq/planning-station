import { HocuspocusProvider } from "@hocuspocus/provider";
import type { PlanMeta } from "@re-cinq/planning-document";

import { transportFor, type ProviderTransport } from "./plan-provider.js";

export interface HocuspocusTransportOptions {
  /** The collaboration endpoint, for example wss://api.example/api/plans/collab. */
  url: string;
  /** The plan's document name: plan:owner/repo:uuid. */
  name: string;
  /** The plan meta the host already fetched; it travels in the document event. */
  meta: PlanMeta;
  token?: string | (() => Promise<string>);
}

/** The reference transport: one HocuspocusProvider behind a PlanTransport. */
export function createHocuspocusTransport(
  options: HocuspocusTransportOptions,
): ProviderTransport {
  const provider = new HocuspocusProvider({
    url: options.url,
    name: options.name,
    token: options.token,
  });

  return transportFor(provider, options.meta);
}
