import { PresenceUser } from './presence-users.js';
interface CursorOwner {
    id?: string;
    name: string;
    color: string;
}
export declare function peerCursor(user: CursorOwner): HTMLElement;
/** Sets each peer's current color as the variable its caret reads. */
export declare function paintPeers(root: HTMLElement, users: readonly PresenceUser[]): void;
export {};
