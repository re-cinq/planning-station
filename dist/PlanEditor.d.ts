import { PlanDocument, PlanTemplate, ValidationPhase, ValidationReport } from '@re-cinq/planning-document';
import { PlanEditorAdapters } from './blocks/adapters.js';
import { RefineRequest } from './blocks/plan-actions.js';
import { PlanTransport, PlanUser } from './session/plan-events.js';
export interface PlanEditorProps {
    transport: PlanTransport;
    user: PlanUser;
    onChange?: (plan: PlanDocument) => void;
    template?: PlanTemplate;
    readOnly?: boolean;
    showOutline?: boolean;
    showPresence?: boolean;
    validationPhase?: ValidationPhase;
    onValidation?: (report: ValidationReport) => void;
    /** A section's Refine button: hand it to the planning agent, which answers with a proposal; a rejection withdraws the ask. */
    onRefine?: (request: RefineRequest) => Promise<void>;
    adapters?: PlanEditorAdapters;
    className?: string;
}
export declare function PlanEditor({ transport, adapters, className, ...props }: PlanEditorProps): import("react").JSX.Element;
