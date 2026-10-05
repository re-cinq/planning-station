import { fromBase64 as e, toBase64 as t } from "@re-cinq/planning-yjs";
import { applyAwarenessUpdate as n, encodeAwarenessUpdate as r } from "y-protocols/awareness";
import { applyUpdate as i, encodeStateAsUpdate as a } from "yjs";
//#region src/session/awareness-change.ts
function o(e) {
	return [
		...e.added,
		...e.updated,
		...e.removed
	];
}
//#endregion
//#region src/transports/plan-provider.ts
var s = "plan-transport";
function c(e, t) {
	let n = /* @__PURE__ */ new Set();
	return l(e, t, (e) => n.forEach((t) => t(e))), {
		send: (t) => f(e, t),
		subscribe: (r) => (n.add(r), p(e, t, r), () => n.delete(r)),
		destroy: () => e.destroy()
	};
}
function l(e, n, r) {
	u(e, n, r), e.document.on("update", (e, n) => d(n, () => r({
		type: "update",
		update: t(e)
	}))), e.awareness?.on("update", (t, n) => d(n, () => r(h(e, t))));
}
function u(e, t, n) {
	e.on("synced", () => n(m(e.document, t))), e.on("authenticationFailed", ({ reason: e }) => n({
		type: "status",
		status: "denied",
		reason: e
	})), e.on("disconnect", () => n({
		type: "status",
		status: "disconnected"
	}));
}
function d(e, t) {
	e !== "plan-transport" && t();
}
function f(t, r) {
	if (r.type === "update") {
		i(t.document, e(r.update), s);
		return;
	}
	let { awareness: a } = t;
	a && n(a, e(r.update), s);
}
function p(e, t, n) {
	e.synced && n(m(e.document, t));
}
function m(e, n) {
	return {
		type: "document",
		meta: n,
		state: t(a(e))
	};
}
function h(e, n) {
	let { awareness: i } = e, a = r(i, o(n));
	return {
		type: "awareness",
		update: t(a)
	};
}
//#endregion
export { o as n, c as t };

//# sourceMappingURL=plan-provider-DncO1qbp.js.map