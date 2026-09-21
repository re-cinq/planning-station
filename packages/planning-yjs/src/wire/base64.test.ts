import { describe, it, expect } from "vitest";

import { fromBase64, toBase64 } from "./base64.js";

describe("toBase64", () => {
  it("encodes the bytes 0, 127 and 255 as AH//", () => {
    expect(toBase64(Uint8Array.of(0, 127, 255))).toEqual("AH//");
  });
});

describe("fromBase64", () => {
  it("decodes what toBase64 encoded for all 256 byte values", () => {
    const bytes = Uint8Array.from([...Array(256).keys()]);
    expect(fromBase64(toBase64(bytes))).toEqual(bytes);
  });
});
