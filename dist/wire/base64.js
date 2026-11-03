export function toBase64(bytes) {
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}
export function fromBase64(text) {
    return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
}
//# sourceMappingURL=base64.js.map