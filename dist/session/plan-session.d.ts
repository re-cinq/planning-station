import { PlanMeta } from '@re-cinq/planning-document';
import { Awareness } from 'y-protocols/awareness';
import { Doc } from 'yjs';
import { PlanTransport, TransportStatus } from './plan-events.js';
export declare const REMOTE = "plan-transport";
export type SessionStatus = TransportStatus | "ready";
export interface SessionState {
    status: SessionStatus;
    meta: PlanMeta | null;
    reason?: string;
}
export interface PlanSession {
    doc: Doc;
    awareness: Awareness;
    state(): SessionState;
    onState(listener: () => void): () => void;
    destroy(): void;
}
export declare function createPlanSession(transport: PlanTransport): PlanSession;
