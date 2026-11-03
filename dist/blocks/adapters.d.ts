import { ReactNode } from 'react';
export interface Mockup {
    format: string;
    markup: string;
    height: number;
}
export interface PlanEditorAdapters {
    renderMockup?: (mockup: Mockup) => ReactNode;
}
export declare const AdaptersContext: import('react').Context<PlanEditorAdapters>;
