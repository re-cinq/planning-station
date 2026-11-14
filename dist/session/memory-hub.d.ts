import { BlockJson, PlanMeta } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
import { PlanTransport } from './plan-events.js';
export interface PlanSeed {
    meta: PlanMeta;
    blocks: readonly BlockJson[];
}
export interface MemoryHub {
    doc: Doc;
    connect(): PlanTransport;
}
export declare function createMemoryHub(seed: PlanSeed): MemoryHub;
export declare function localTransport(seed: PlanSeed): PlanTransport;
