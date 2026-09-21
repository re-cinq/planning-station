import styles from "./SessionNotice.module.scss";
import type { SessionStatus } from "./plan-session.js";

export interface SessionNoticeProps {
  status: SessionStatus;
  reason?: string;
}

const MESSAGES: Readonly<Record<SessionStatus, string>> = {
  connecting: "Connecting to the plan…",
  ready: "Connected.",
  disconnected:
    "Offline. Keep writing; your changes sync when the connection returns.",
  denied: "You do not have access to this plan.",
};

export function SessionNotice({ status, reason }: SessionNoticeProps) {
  return (
    <p className={styles.notice} role="status" data-status={status}>
      {MESSAGES[status]}
      {reason && ` ${reason}`}
    </p>
  );
}
