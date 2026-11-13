import { Problem } from '@re-cinq/planning-document';
import { OutlineSection } from './outline-sections.js';
export type SectionState = "ready" | "problem" | "missing";
export interface SectionRow {
    section: OutlineSection;
    problems: readonly Problem[];
}
export interface RequiredProgress {
    ready: number;
    total: number;
}
export declare function sectionState(section: OutlineSection, problems: readonly Problem[]): SectionState;
export declare function requiredProgress(rows: readonly SectionRow[]): RequiredProgress;
