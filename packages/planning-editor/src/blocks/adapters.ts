import { createContext, type ReactNode } from "react";

export interface Mockup {
  /** What the sketch draws (architecture, flow, ui, …); "" on a mockup made before sketches had kinds. */
  kind: string;
  caption: string;
  format: string;
  markup: string;
  height: number;
}

export interface PlanEditorAdapters {
  renderMockup?: (mockup: Mockup) => ReactNode;
}

export const AdaptersContext = createContext<PlanEditorAdapters>({});
