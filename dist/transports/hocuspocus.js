import { t as e } from "../plan-provider-DncO1qbp.js";
import { HocuspocusProvider as t } from "@hocuspocus/provider";
//#region src/transports/hocuspocus.ts
function n(n) {
	let r = new t({
		url: n.url,
		name: n.name,
		token: n.token
	});
	return e(r, n.meta);
}
//#endregion
export { n as createHocuspocusTransport };

//# sourceMappingURL=hocuspocus.js.map