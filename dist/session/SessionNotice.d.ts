import { SessionStatus } from './plan-session.js';
export interface SessionNoticeProps {
    status: SessionStatus;
    reason?: string;
}
export declare function SessionNotice({ status, reason }: SessionNoticeProps): import("react").JSX.Element;
