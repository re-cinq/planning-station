/** Whether Mod is the Command key, and Control a key that moves and deletes in text, as it is on Apple's systems. */
export const IS_APPLE =
  typeof navigator !== "undefined" &&
  /Mac|iP(hone|[oa]d)/.test(navigator.platform);
