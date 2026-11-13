export interface ColorClaim {
    clientId: number;
    userId: string;
    joinedAt: number;
    /** The color the peer announces now; kept when no one who joined earlier holds it, so nobody is recolored when someone leaves. */
    color?: string;
}
export declare const PALETTE: readonly string[];
export declare function assignColors(claims: readonly ColorClaim[]): Map<string, string>;
