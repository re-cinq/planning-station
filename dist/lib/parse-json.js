// JSON.parse is the one way to read JSON, and it throws on text that is not.
export function parseJson(body) {
    try {
        return JSON.parse(body);
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=parse-json.js.map