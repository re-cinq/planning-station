const SEED_LOW = 0xdeadbeef;
const SEED_HIGH = 0x41c6ce57;
const ABSORB_LOW = 2654435761;
const ABSORB_HIGH = 1597334677;
const SCRAMBLE = 2246822507;
const CROSS = 3266489909;
const SCRAMBLE_SHIFT = 16;
const CROSS_SHIFT = 13;
const HIGH_BITS = 2097151;
const HIGH_SHIFT = 4294967296;
const HEX = 16;
/** A 53-bit cyrb53 hash: cheap enough for a browser, and not a security boundary. */
export function shortHash(text) {
    const [first, second] = [...text].reduce(absorb, [SEED_LOW, SEED_HIGH]);
    const low = scramble(first, second);
    const high = scramble(second, low);
    return (HIGH_SHIFT * (HIGH_BITS & high) + (low >>> 0)).toString(HEX);
}
function absorb([first, second], char) {
    const code = char.codePointAt(0) ?? 0;
    return [
        Math.imul(first ^ code, ABSORB_LOW),
        Math.imul(second ^ code, ABSORB_HIGH),
    ];
}
function scramble(value, other) {
    const mixed = Math.imul(value ^ (value >>> SCRAMBLE_SHIFT), SCRAMBLE);
    return mixed ^ Math.imul(other ^ (other >>> CROSS_SHIFT), CROSS);
}
//# sourceMappingURL=short-hash.js.map