import { PlanTransport } from './plan-events.js';
import { PlanSession, SessionState } from './plan-session.js';
export declare function usePlanSession(transport: PlanTransport): PlanSession | null;
export declare function useSessionState(session: PlanSession): SessionState;
