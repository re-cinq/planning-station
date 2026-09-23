import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as ee, useState as u, useSyncExternalStore as te } from "react";
import { BlockNoteView as ne } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as d, PLAN_FRAGMENT as re, changeWords as ie, diffPlans as ae, findSectionSlot as f, isRequiredAt as oe, newId as p, optionsOf as se, parseBlock as ce, previewProposal as le, refineInputs as ue, settledCount as de, templateFor as fe, toPlanDocument as pe, usesOf as me, validatePlan as he } from "@re-cinq/planning-document";
import { createPortal as ge } from "react-dom";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
import { offset as _e } from "@floating-ui/react";
import { SideMenuExtension as ve } from "@blocknote/core/extensions";
import { SideMenu as ye, SideMenuController as be, SuggestionMenuController as xe, createReactBlockSpec as _, useBlockNoteEditor as v, useCreateBlockNote as Se, useEditorChange as Ce, useExtensionState as we } from "@blocknote/react";
import { BlockNoteSchema as Te, createExtension as Ee, filterSuggestionItems as De, insertOrUpdateBlockForSlashMenu as Oe } from "@blocknote/core";
import { Plugin as ke, PluginKey as Ae } from "prosemirror-state";
import { yCursorPluginKey as je, ySyncPluginKey as Me } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as Ne, acceptChange as Pe, acceptRefine as Fe, applyChangeAnyway as Ie, applyRefineAnyway as Le, askRefine as Re, changesIn as ze, discardChange as Be, discardRefine as Ve, docFromBlocks as He, fromBase64 as y, proposalsIn as Ue, readBlocks as We, staleChanges as Ge, toBase64 as b } from "@re-cinq/planning-yjs";
import { Awareness as Ke, applyAwarenessUpdate as x, encodeAwarenessUpdate as S } from "y-protocols/awareness";
import { Doc as qe, applyUpdate as C, encodeStateAsUpdate as Je } from "yjs";
import { withCollaboration as Ye } from "@blocknote/core/yjs";
import { Decoration as Xe, DecorationSet as Ze } from "prosemirror-view";
//#region src/blocks/adapters.ts
var Qe = n({}), $e = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function w() {
	return i($e);
}
var T = {
	change: "_change_zymrw_1",
	words: "_words_zymrw_12",
	dropped: "_dropped_zymrw_17",
	who: "_who_zymrw_23",
	stale: "_stale_zymrw_29",
	bar: "_bar_zymrw_35"
}, E = {
	bar: "_bar_1g503_1",
	note: "_note_1g503_9",
	refine: "_refine_1g503_14",
	quiet: "_quiet_1g503_38",
	proposal: "_proposal_1g503_54",
	stale: "_stale_1g503_64",
	lines: "_lines_1g503_70",
	kept: "_kept_1g503_78",
	added: "_added_1g503_82",
	removed: "_removed_1g503_86"
};
//#endregion
//#region src/blocks/InlineChanges.tsx
function et({ changes: e, hosts: t }) {
	return /* @__PURE__ */ h(m, { children: e.map((e) => /* @__PURE__ */ h(tt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function tt({ review: e, host: t }) {
	return t ? ge(/* @__PURE__ */ h(nt, { review: e }), t) : null;
}
function nt({ review: e }) {
	return /* @__PURE__ */ g("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: T.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h(at, { change: e.change }),
			e.stale && /* @__PURE__ */ h(rt, {}),
			/* @__PURE__ */ h(it, { review: e })
		]
	});
}
function rt() {
	return /* @__PURE__ */ h("p", {
		className: T.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function it({ review: e }) {
	return /* @__PURE__ */ g("p", {
		className: T.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: E.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function at({ change: e }) {
	let t = ie(e);
	return t.length > 0 ? t.map((e, t) => /* @__PURE__ */ h("p", {
		className: T.words,
		children: e
	}, t)) : /* @__PURE__ */ h("p", {
		className: T.dropped,
		children: "This paragraph goes."
	});
}
//#endregion
//#region src/template/template-guard.ts
var ot = "planTemplateBypass", st = "section-heading", ct = "blockContent", lt = [
	"plan-title",
	st,
	"section-panel",
	"section-actions"
], ut = Ee({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new ke({ filterTransaction: ft })]
});
function dt(e, t) {
	return e.setMeta(ot, t);
}
function ft(e, t) {
	if (!e.docChanged || pt(e)) return !0;
	let n = mt(t.doc), r = mt(e.doc);
	return yt(gt(n), gt(r)) && _t(n, r);
}
function pt(e) {
	let t = e.getMeta(Me);
	return !!e.getMeta(ot) || t?.isChangeOrigin === !0;
}
function mt(e) {
	let t = [];
	return e.descendants((e) => {
		ht(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function ht(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(ct);
}
function gt(e) {
	return e.filter((e) => lt.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function _t(e, t) {
	return vt(t) === 0 || vt(e) > 0;
}
function vt(e) {
	let t = e.findIndex((e) => e.type === st);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function yt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var bt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [_e(({ elements: e, rects: t }) => {
		let n = Ct(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function xt() {
	return /* @__PURE__ */ h(be, {
		floatingUIOptions: bt,
		sideMenu: St
	});
}
function St() {
	let e = we(ve, { selector: (e) => e?.block.type });
	return e === void 0 || lt.includes(e) ? null : /* @__PURE__ */ h(ye, {});
}
function Ct(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? wt(t) : null;
}
function wt(e) {
	let t = Tt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Tt(e) {
	let t = Et(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Dt(n);
}
function Et(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Dt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Ot(e) {
	return e;
}
function kt(e) {
	return e.map(ce);
}
function D(e, t) {
	return pe(kt(e), t);
}
var O = {
	comment: "_comment_xr1pj_1",
	text: "_text_xr1pj_23",
	who: "_who_xr1pj_27",
	author: "_author_xr1pj_36",
	when: "_when_xr1pj_40",
	badge: "_badge_xr1pj_44",
	actions: "_actions_xr1pj_54",
	reply: "_reply_xr1pj_78",
	input: "_input_xr1pj_82"
}, At = { props: { resolved: !0 } }, jt = { props: { resolved: !1 } };
function Mt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = Bt(A(e));
	return /* @__PURE__ */ g("aside", {
		className: O.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${j(e)}`,
		...Nt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ h(Pt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ h("div", {
				className: O.text,
				ref: n
			}),
			!r && t.isEditable && /* @__PURE__ */ h(Ft, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Nt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Pt({ block: e, resolved: t }) {
	return /* @__PURE__ */ g("p", {
		className: O.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: O.author,
				children: j(e)
			}),
			/* @__PURE__ */ h("time", {
				className: O.when,
				children: Gt(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: O.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Ft({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: O.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ h(k, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, jt)
		}) : /* @__PURE__ */ h(It, {
			block: e,
			editor: t
		})
	});
}
function It({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ g(m, { children: [n ? /* @__PURE__ */ h(Lt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(k, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(k, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, At)
	})] });
}
function k({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Lt({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = zt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: O.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h(Rt, {
			to: j(e),
			draft: r,
			onDraft: i
		})
	});
}
function Rt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: O.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function zt({ editor: e, block: t }) {
	let { user: n } = w(), r = v();
	return (i) => {
		if (!i) return;
		let a = A(t), o = r.document, s = Ht(o, a) ?? t;
		e.insertBlocks([Wt(a, i, n.name)], s, "after");
	};
}
function Bt(e) {
	let t = v(), n = () => Vt(t.document, e), [r, i] = u(n);
	return Ce(() => i(n())), r;
}
function Vt(e, t) {
	return e.some((e) => Ut(e) && A(e) === t && e.props.resolved === !0);
}
function Ht(e, t) {
	return e.filter((e) => e.type === "comment" && A(e) === t).at(-1);
}
function Ut(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function A(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function j(e) {
	return String(e.props.author || "Someone");
}
function Wt(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: p("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function Gt(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var M = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function Kt({ block: e }) {
	let { renderMockup: t } = o(Qe);
	return /* @__PURE__ */ g("figure", {
		className: M.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ g("figcaption", {
			className: M.label,
			children: [
				"Mockup (",
				e.props.format,
				")"
			]
		}), t ? t(e.props) : /* @__PURE__ */ h("p", { children: "The host renders mockups; none is configured." })]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var qt = {
	kpi: {
		label: () => "KPI",
		fields: [
			"metric",
			"baseline",
			"target",
			"direction",
			"deadline"
		],
		placeholder: "Why this number matters"
	},
	prototype: {
		label: () => "Prototype",
		fields: [
			"maturity",
			"url",
			"agreedBy"
		],
		placeholder: "What people can try in it",
		link: {
			text: "Open prototype",
			href: (e) => String(e.url ?? "")
		}
	},
	answer: {
		label: () => "Answer",
		fields: [],
		placeholder: "The decision"
	}
}, N = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, Jt = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function Yt({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: N.steps,
		disabled: r
	};
	return /* @__PURE__ */ g("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ h("legend", {
			className: N.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ h(Xt, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function Xt({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ g("label", {
		className: N.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ h("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), Jt[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var Zt = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function Qt(e, t) {
	return e[String(t)] ?? String(t);
}
var P = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function $t({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ g("span", {
		className: P.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: P.label,
			htmlFor: n,
			children: Qt(Zt, e)
		}), /* @__PURE__ */ h(en, {
			...t,
			id: n
		})]
	});
}
function en(e) {
	return e.spec.values ? /* @__PURE__ */ h(tn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ h(nn, { ...e });
}
function tn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ h("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ h("option", { children: e }, e))
	});
}
function nn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ h("input", {
		id: e,
		className: P.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var rn = { maturity: Yt };
function an({ block: e, editor: t, contentRef: n }) {
	let r = qt[e.type];
	return /* @__PURE__ */ g("div", {
		className: M.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(on, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ h("div", {
			className: M.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function on({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: M.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: M.head,
			children: [/* @__PURE__ */ h("span", {
				className: M.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ h(sn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ h(cn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function sn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ g("a", {
		className: M.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ h("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function cn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(rn[n] ?? $t, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var ln = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function un({ contentRef: e }) {
	return /* @__PURE__ */ h("h1", {
		className: ln.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var F = {
	question: "_question_138nm_1",
	asked: "_asked_138nm_8",
	label: "_label_138nm_17",
	why: "_why_138nm_21",
	how: "_how_138nm_25",
	text: "_text_138nm_31",
	suggestions: "_suggestions_138nm_35",
	suggestion: "_suggestion_138nm_35",
	answerBox: "_answerBox_138nm_61",
	answerInput: "_answerInput_138nm_67",
	answerButton: "_answerButton_138nm_85"
};
//#endregion
//#region src/blocks/QuestionView.tsx
function dn({ block: e, editor: t, contentRef: n }) {
	let r = se(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: F.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(fn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: F.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ h(pn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function fn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ h("p", {
		className: F.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ h("span", {
			className: F.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ g("p", {
		className: F.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: F.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ h("span", {
				className: F.why,
				children: e
			}),
			/* @__PURE__ */ h("span", {
				className: F.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function pn({ block: e, editor: t, options: n }) {
	return vn(R(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(mn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ h(gn, {
		block: e,
		editor: t
	});
}
function mn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ h("ul", {
		className: F.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(hn, {
			onPick: () => I(t, e, n),
			children: n
		}) }, n))
	});
}
function hn({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: F.suggestion,
		onClick: e,
		children: t
	});
}
function gn({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ g("form", {
		className: F.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), I(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(_n, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: F.answerButton,
			children: "Answer"
		})]
	});
}
function _n({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
		className: F.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function I(e, t, n) {
	if (!n) return;
	let r = R(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function vn(e) {
	let t = v(), [n, r] = u(() => L(t.document, e));
	return Ce(() => r(L(t.document, e))), n;
}
function L(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function R(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var z = n(null), yn = n(/* @__PURE__ */ new Map());
function B(e) {
	let t = o(z), n = o(yn).get(e);
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var V = /* @__PURE__ */ new WeakMap();
function bn(e, t) {
	let n = Sn(e);
	return l(() => {
		let n = Cn(e), r = ue(n, t), i = Ue(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: de(r),
			proposal: i,
			preview: i?.status === "proposed" ? le(n, i) : void 0,
			...xn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function xn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: me(n),
			baseHash: Re(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Fe(e, t),
		applyAnyway: () => void Le(e, t),
		discard: () => Ve(e, t)
	};
}
function Sn(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function Cn(e) {
	let t = V.get(e);
	if (t) return t;
	let n = We(e);
	return V.set(e, n), e.once("update", () => V.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function wn(e) {
	let t = bn(e.doc, e.slot), n = Tn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ h(On, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ h(Dn, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ h(En, { ...r });
}
function Tn({ slot: e, title: t }, n) {
	let { user: r, onRefine: i } = w();
	return () => {
		let a = n.ask(r.name);
		i?.({
			slot: e,
			title: t,
			...a
		}).catch(() => n.discard());
	};
}
function En({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ g("p", {
		className: E.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: E.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ h("span", {
			className: E.note,
			children: n ? `uses ${Nn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Dn({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ g("p", {
		className: E.bar,
		role: "status",
		children: [/* @__PURE__ */ g("span", {
			className: E.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function On({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ g("section", {
		className: E.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ g("p", {
				className: E.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					Pn(r)
				]
			}),
			/* @__PURE__ */ h(jn, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ g("p", {
				className: E.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ h(kn, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function kn({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ g("p", {
		className: E.bar,
		children: [
			/* @__PURE__ */ h("button", {
				type: "button",
				className: E.refine,
				onClick: i,
				children: r
			}),
			n && /* @__PURE__ */ h(An, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ h(An, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function An({ label: e, run: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: E.quiet,
		onClick: t,
		children: e
	});
}
function jn({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: E.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: E[e.kind],
			children: /* @__PURE__ */ h(Mn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function Mn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
}
function Nn({ inputs: e }) {
	return Fn(e.answered.length, e.resolved.length);
}
function Pn({ uses: e }) {
	let t = Fn(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Fn(e, t) {
	return [In(e, "answer"), In(t, "resolved thread")].filter(Boolean).join(", ");
}
function In(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var Ln = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function Rn({ block: e, editor: t }) {
	let { slot: n, title: r } = zn(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: Ln.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(wn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function zn(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: B(t)?.title ?? t
	};
}
var H = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function Bn({ block: e }) {
	let t = B(e.props.slot);
	return /* @__PURE__ */ g("header", {
		className: H.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("h2", {
			className: H.title,
			children: e.props.title
		}), t && /* @__PURE__ */ h("p", {
			className: H.hint,
			children: t.hint
		})]
	});
}
var U = {
	panel: "_panel_1ajor_1",
	commentBox: "_commentBox_1ajor_11",
	input: "_input_1ajor_17",
	send: "_send_1ajor_34"
};
//#endregion
//#region src/blocks/SectionPanel.tsx
function Vn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = B(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: U.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Hn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function Hn({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = u("");
	return /* @__PURE__ */ g("form", {
		className: U.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(Wn({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ h("input", {
			className: U.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ h(Un, {})]
	});
}
function Un() {
	return /* @__PURE__ */ h("button", {
		type: "submit",
		className: U.send,
		children: "Comment"
	});
}
function Wn({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([Gn(n, r)], e, "before"), "");
}
function Gn(e, t) {
	return {
		type: "comment",
		props: {
			commentId: p("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var W = { render: an }, Kn = {
	"plan-title": _(d["plan-title"], { render: un })(),
	"section-heading": _(d["section-heading"], { render: Bn })(),
	"section-panel": _(d["section-panel"], { render: Vn })(),
	"section-actions": _(d["section-actions"], { render: Rn })(),
	comment: _(d.comment, { render: Mt })(),
	kpi: _(d.kpi, W)(),
	prototype: _(d.prototype, W)(),
	mockup: _(d.mockup, { render: Kt })(),
	question: _(d.question, { render: dn })(),
	answer: _(d.answer, W)()
}, G = Te.create({ blockSpecs: {
	...Ne,
	...Kn
} });
//#endregion
//#region src/menu/section-context.ts
function qn(e, t) {
	let [n] = Yn(e, t);
	return n ? String(n.props.slot) : null;
}
function Jn(e, t) {
	let n = Yn(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Yn(e, t) {
	let n = e.slice(0, Xn(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Xn(e, t) {
	return e.findIndex((e) => Zn(e, t));
}
function Zn(e, t) {
	return e.id === t || e.children.some((e) => Zn(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", Qn = { cells: [
	"",
	"",
	""
] }, $n = [
	{
		kind: "paragraph",
		title: "Paragraph",
		group: K,
		aliases: ["p"]
	},
	{
		kind: "heading",
		title: "Heading",
		group: K,
		aliases: ["h2"],
		props: () => ({ level: 2 })
	},
	{
		kind: "heading",
		title: "Subheading",
		group: K,
		aliases: ["h3"],
		props: () => ({ level: 3 })
	},
	{
		kind: "bulletListItem",
		title: "Bullet list",
		group: K,
		aliases: ["ul"]
	},
	{
		kind: "numberedListItem",
		title: "Numbered list",
		group: K,
		aliases: ["ol"]
	},
	{
		kind: "checkListItem",
		title: "Checklist",
		group: K,
		aliases: ["todo"]
	},
	{
		kind: "quote",
		title: "Quote",
		group: K
	},
	{
		kind: "codeBlock",
		title: "Code",
		group: K
	},
	{
		kind: "table",
		title: "Table",
		group: K,
		content: {
			type: "tableContent",
			rows: [Qn, Qn]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: q,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: p("kpi") })
	},
	{
		kind: "prototype",
		title: "Prototype",
		group: q
	},
	{
		kind: "mockup",
		title: "Mockup",
		group: q
	},
	{
		kind: "question",
		title: "Question",
		group: q,
		props: () => ({ questionId: p("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: q,
		props: (e) => {
			let t = Jn(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function er(e, t) {
	return $n.filter((t) => e.allows.includes(t.kind)).flatMap((e) => tr(e, t));
}
function tr(e, t) {
	let n = e.props ? e.props(t) : {};
	if (n === null) return [];
	let r = e.content === void 0 ? {} : { content: e.content };
	return [{
		title: e.title,
		group: e.group,
		aliases: e.aliases ?? [],
		block: {
			type: e.kind,
			props: n,
			...r
		}
	}];
}
//#endregion
//#region src/menu/PlanSlashMenu.tsx
function nr() {
	let e = v(G), t = o(z);
	return /* @__PURE__ */ h(xe, {
		triggerCharacter: "/",
		getItems: async (n) => De(rr(e, t), n)
	});
}
function rr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && ir(t, i);
	return a ? er(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Oe(e, Ot(t))
	})) : [];
}
function ir(e, { blocks: t, cursorId: n }) {
	let r = qn(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function ar(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => or(e, t, n));
}
function or(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && oe(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function sr(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var J = {
	outline: "_outline_su1wu_1",
	phase: "_phase_su1wu_6",
	slots: "_slots_su1wu_13",
	title: "_title_su1wu_20",
	required: "_required_su1wu_24",
	problems: "_problems_su1wu_28",
	footer: "_footer_su1wu_34"
}, cr = [];
function lr({ template: e, report: t, sections: n = cr, children: r }) {
	return /* @__PURE__ */ g("nav", {
		className: J.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ g("p", {
				className: J.phase,
				children: [
					t.passed ? "Ready for" : "Not ready for",
					" ",
					t.phase
				]
			}),
			/* @__PURE__ */ h(ur, {
				template: e,
				report: t,
				sections: n
			}),
			r && /* @__PURE__ */ h("div", {
				className: J.footer,
				children: r
			})
		]
	});
}
function ur({ template: e, report: t, sections: n }) {
	let r = sr(t.problems);
	return /* @__PURE__ */ h("ol", {
		className: J.slots,
		children: ar(e, n, t.phase).map((e) => /* @__PURE__ */ h(dr, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function dr({ section: e, problems: t }) {
	return /* @__PURE__ */ g("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ h("span", {
				className: J.title,
				children: e.title
			}),
			e.required && /* @__PURE__ */ h("span", {
				className: J.required,
				children: " required"
			}),
			/* @__PURE__ */ h("ul", {
				className: J.problems,
				children: t.map((e) => /* @__PURE__ */ h("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var Y = {
	editor: "_editor_19wtq_1",
	withSidebar: "_withSidebar_19wtq_9",
	single: "_single_19wtq_13",
	sidebar: "_sidebar_19wtq_17"
}, X = {
	participants: "_participants_64cvt_1",
	locate: "_locate_64cvt_16",
	away: "_away_64cvt_17",
	dot: "_dot_64cvt_38"
};
//#endregion
//#region src/presence/presence-users.ts
function fr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [pr(e, n)]);
}
function pr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: mr(n),
		hasCursor: r != null
	};
}
function mr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function hr(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function gr(e) {
	let [t, n] = u(() => vr(e));
	return s(() => {
		let t = () => n(vr(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function _r(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: qn(r, n.id) });
	}), [e, t]);
}
function vr(e) {
	return fr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function yr({ awareness: e, ...t }) {
	let n = gr(e);
	return /* @__PURE__ */ h("ul", {
		className: X.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(br, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function br({ user: e, template: t, titles: n, onLocate: r }) {
	let i = hr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ h("button", {
		type: "button",
		className: X.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: xr,
		onClick: () => r(e),
		children: /* @__PURE__ */ h(Sr, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ h("span", {
		className: X.away,
		children: /* @__PURE__ */ h(Sr, {
			color: e.color,
			label: i
		})
	});
}
function xr(e) {
	e.preventDefault();
}
function Sr({ color: e, label: t }) {
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("svg", {
		className: X.dot,
		viewBox: "0 0 2 2",
		"aria-hidden": "true",
		children: /* @__PURE__ */ h("circle", {
			cx: "1",
			cy: "1",
			r: "1",
			fill: e
		})
	}), t] });
}
//#endregion
//#region src/presence/scroll-to-cursor.ts
function Cr(e, t) {
	let n = e.prosemirrorView, r = wr(n, t);
	r !== null && Tr(n, r)?.scrollIntoView({ block: "center" });
}
function wr(e, t) {
	let [n] = je.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Tr(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Er = { notice: "_notice_1xdcv_1" }, Dr = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: Er.notice,
		role: "status",
		"data-status": e,
		children: [Dr[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Or(e, t) {
	let n = Ar(e, t);
	return l(() => kr(e), [e, n]);
}
function kr(e) {
	let t = new Set(Ge(e).map((e) => e.changeId));
	return ze(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Ie(e, n.changeId) : Pe(e, n.changeId),
		discard: () => Be(e, n.changeId)
	}));
}
function Ar(e, t) {
	let [n, r] = u(0), i = ee(t);
	return i.current = t, s(() => {
		let t = () => {
			r((e) => e + 1), i.current?.();
		};
		return e.on("update", t), t(), () => e.off("update", t);
	}, [e]), n;
}
//#endregion
//#region src/session/plan-session.ts
var Q = "plan-transport";
function jr(e) {
	let t = new qe(), n = {
		doc: t,
		awareness: new Ke(t)
	}, r = Nr({
		status: "connecting",
		meta: null
	});
	Ir(n, e);
	let i = e.subscribe((e) => Fr({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Mr(n, i)
	};
}
function Mr({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Nr(e) {
	let t = e, n = /* @__PURE__ */ new Set();
	return {
		get: () => t,
		set: (e) => {
			t = {
				...t,
				...e
			}, n.forEach((e) => e());
		},
		listen: (e) => (n.add(e), () => n.delete(e))
	};
}
var Pr = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		C(e, y(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => C(e, y(t), Q),
	awareness: ({ awareness: e }, { update: t }) => x(e, y(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Fr(e, t) {
	Pr[t.type](e, t);
}
function Ir({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: b(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = S(n, e(t));
		r.send({
			type: "awareness",
			update: b(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function Lr(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = jr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Rr(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var zr = new Ae("planChangeWidgets");
function Br(e, t) {
	return Ee({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new ke({
			key: zr,
			props: { decorations: (n) => Ze.create(n.doc, Vr(n, e, t)) }
		})]
	});
}
function Vr(e, t, n) {
	let r = Gr(e);
	return ze(t).flatMap((e) => {
		let t = Hr(r, e);
		return t === void 0 ? [] : [Ur(t, e, n)];
	});
}
function Hr(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ur(e, t, n) {
	return Xe.widget(e, () => Wr(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Wr(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Gr(e) {
	let t = {
		ends: /* @__PURE__ */ new Map(),
		starts: /* @__PURE__ */ new Map()
	};
	return e.doc.descendants((e, n) => {
		let r = String(e.attrs.id ?? "");
		return r && !t.ends.has(r) && (t.ends.set(r, n + e.nodeSize), t.starts.set(r, n)), !0;
	}), t;
}
//#endregion
//#region src/use-plan-editor.ts
function Kr({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = qr(e, n, i), s = Jr(o, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => D(s, t), [s, t]),
		hosts: i
	};
}
function qr(e, t, n) {
	let { doc: r } = e;
	return Se(Ye({
		schema: G,
		extensions: [ut, Br(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function Jr(e, t, n) {
	let [r, i] = u(() => We(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Yr = {};
function Xr({ transport: e, adapters: t = Yr, className: n, ...r }) {
	let i = Lr(e), a = Zr(r);
	return /* @__PURE__ */ h(Qe, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: Qr({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ h($r, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ h(Z, { status: "connecting" })
		})
	});
}
function Zr({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function Qr({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? Y.withSidebar : Y.single;
	return [
		Y.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function $r({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Rr(t.session);
	if (!r) return /* @__PURE__ */ h(Z, {
		status: n,
		reason: i
	});
	let a = e ?? fe(r.type);
	return /* @__PURE__ */ g(z, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ h(Z, {
			status: n,
			reason: i
		}), /* @__PURE__ */ h(ei, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ei({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = Kr(r), l = ti(i, o, c), ee = ci(s, e, t);
	return _r(o, i.awareness), /* @__PURE__ */ h($e, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(ni, {
			...r,
			...l,
			...s,
			report: ee
		})
	});
}
function ti(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function ni(e) {
	let t = ii(e.sections);
	return /* @__PURE__ */ g(yn, {
		value: t,
		children: [/* @__PURE__ */ h(si, { ...e }), /* @__PURE__ */ h(ri, {
			...e,
			titles: t
		})]
	});
}
function ri({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ g("aside", {
		className: Y.sidebar,
		children: [e && /* @__PURE__ */ h(ai, { ...n }), t && /* @__PURE__ */ h(oi, { ...n })]
	});
}
function ii(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function ai({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ h(yr, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => Cr(e, t.clientId)
	});
}
function oi({ template: e, report: t, sections: n, outlineFooter: r }) {
	return /* @__PURE__ */ h(lr, {
		template: e,
		report: t,
		sections: n,
		children: r
	});
}
function si({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Or(n, () => li(e));
	return /* @__PURE__ */ g(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ h(nr, {}),
			/* @__PURE__ */ h(xt, {}),
			/* @__PURE__ */ h(et, {
				changes: i,
				hosts: r
			})
		]
	});
}
function ci(e, t, n) {
	let r = l(() => he(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function li(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ui(e) {
	let t = He(e.blocks), n = new Ke(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return fi(r), {
		doc: t,
		connect: () => mi(r)
	};
}
function di(e) {
	return ui(e).connect();
}
function fi(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => pi(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = S(r, e(n));
		pi(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function pi(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function mi(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => hi(e, t, n),
		subscribe: (n) => (t.handlers.add(n), gi(e, n), () => t.handlers.delete(n))
	};
}
function hi(e, t, n) {
	if (n.type === "update") {
		C(e.doc, y(n.update), t);
		return;
	}
	x(e.awareness, y(n.update), t);
}
function gi({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: b(Je(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = S(t, i);
		r({
			type: "awareness",
			update: b(e)
		});
	}
}
var $ = {
	diff: "_diff_ae496_1",
	same: "_same_ae496_7",
	meta: "_meta_ae496_11",
	title: "_title_ae496_17",
	lines: "_lines_ae496_23",
	kept: "_kept_ae496_30",
	added: "_added_ae496_34",
	removed: "_removed_ae496_38",
	changed: "_changed_ae496_42"
}, _i = {
	kept: " ",
	added: "+",
	removed: "-"
};
function vi({ before: e, after: t, className: n }) {
	let r = ae(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ g("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ h("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ h(yi, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(bi, { section: e }, e.slot)),
			/* @__PURE__ */ h(xi, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function yi({ changes: e }) {
	return /* @__PURE__ */ h("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ g("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function bi({ section: e }) {
	return /* @__PURE__ */ g("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ h("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ h("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ g("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ g("span", {
					"aria-hidden": "true",
					children: [_i[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function xi({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ g("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ h("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ h("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ g("li", {
				className: $[e.kind],
				children: [
					e.id,
					" ",
					e.kind
				]
			}, e.id))
		})]
	});
}
//#endregion
export { vi as PlanDiffView, Xr as PlanEditor, dt as bypassTemplate, ui as createMemoryHub, kt as fromEditorBlocks, di as localTransport, G as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map