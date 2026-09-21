import { createContext, type ReactNode } from "react";

export interface Mockup {
  format: string;
  markup: string;
  height: number;
}

export interface PlanEditorAdapters {
  renderMockup?: (mockup: Mockup) => ReactNode;
}

export const AdaptersContext = createContext<PlanEditorAdapters>({});
