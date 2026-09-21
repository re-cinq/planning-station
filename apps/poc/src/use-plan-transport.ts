import { useEffect, useState } from "react";
import { createHocuspocusTransport } from "@re-cinq/planning-editor/transports/hocuspocus";
import type { ProviderTransport } from "@re-cinq/planning-editor";

import type { PlanServer } from "./plan-server.js";

/** One socket for this tab; another tab opens its own and sees this one. */
export function usePlanTransport(
  server: PlanServer | null,
  who: string,
): ProviderTransport | null {
  const [transport, setTransport] = useState<ProviderTransport | null>(null);

  useEffect(() => {
    if (!server) {
      return;
    }

    const own = createHocuspocusTransport({
      url: server.wsUrl,
      name: server.documentName,
      meta: server.meta,
      token: who,
    });
    setTransport(own);

    return () => own.destroy();
  }, [server, who]);

  return transport;
}
