import { PlanTemplate, SectionSlot } from '@re-cinq/planning-document';
export declare const TemplateContext: import('react').Context<PlanTemplate | null>;
/** Each section's title as its heading carries it, so a section the agent added goes by the title it gave. */
export declare const SectionTitlesContext: import('react').Context<ReadonlyMap<string, string>>;
export declare function useSlot(slot: string): SectionSlot | undefined;
