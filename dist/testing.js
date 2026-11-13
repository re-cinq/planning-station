import { plainText as e, toPlanDocument as t } from "@re-cinq/planning-document";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/testing/PlanEditorStub.tsx
function i({ meta: e, initialBlocks: i }) {
	let o = t(i, e);
	return /* @__PURE__ */ n("article", {
		"aria-label": o.title,
		children: o.sections.map((e) => /* @__PURE__ */ r("section", {
			"aria-label": e.title,
			children: [/* @__PURE__ */ n("h2", { children: e.title }), e.blocks.map((e) => /* @__PURE__ */ n("p", { children: a(e) }, e.id))]
		}, e.headingId))
	});
}
function a(t) {
	return Array.isArray(t.content) ? e(t.content) : "";
}
//#endregion
export { i as PlanEditorStub };

//# sourceMappingURL=testing.js.map