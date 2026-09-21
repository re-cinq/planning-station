import { useEffect, useState, useSyncExternalStore } from "react";

import type { PlanTransport } from "./plan-events.js";
import {
  createPlanSession,
  type PlanSession,
  type SessionState,
} from "./plan-session.js";

export function usePlanSession(transport: PlanTransport): PlanSession | null {
  const [session, setSession] = useState<PlanSession | null>(null);

  useEffect(() => {
    const created = createPlanSession(transport);
    setSession(created);

    return () => created.destroy();
  }, [transport]);

  return session;
}

export function useSessionState(session: PlanSession): SessionState {
  return useSyncExternalStore(session.onState, session.state);
}
