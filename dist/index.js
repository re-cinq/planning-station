import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as f, PLAN_FRAGMENT as ne, changeWords as re, diffPlans as ie, findSectionSlot as p, isRequiredAt as ae, newId as m, optionsOf as oe, parseBlock as se, previewProposal as ce, refineInputs as le, settledCount as ue, templateFor as de, toPlanDocument as fe, usesOf as pe, validatePlan as me } from "@re-cinq/planning-document";
import { createPortal as he } from "react-dom";
import { Fragment as ge, jsx as h, jsxs as g } from "react/jsx-runtime";
import { offset as _e } from "@floating-ui/react";
import { SideMenuExtension as ve } from "@blocknote/core/extensions";
import { SideMenu as ye, SideMenuController as be, SuggestionMenuController as xe, createReactBlockSpec as _, useBlockNoteEditor as v, useCreateBlockNote as Se, useEditorChange as Ce, useExtensionState as we } from "@blocknote/react";
import { BlockNoteSchema as Te, createExtension as Ee, filterSuggestionItems as De, insertOrUpdateBlockForSlashMenu as Oe } from "@blocknote/core";
import { Plugin as ke, PluginKey as Ae } from "prosemirror-state";
import { ySyncPluginKey as je } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as Me, acceptChange as Ne, acceptRefine as Pe, applyChangeAnyway as Fe, applyRefineAnyway as Ie, askRefine as Le, changesIn as Re, discardChange as ze, discardRefine as Be, docFromBlocks as Ve, fromBase64 as y, proposalsIn as He, readBlocks as Ue, staleChanges as We, toBase64 as b } from "@re-cinq/planning-yjs";
import { Awareness as Ge, applyAwarenessUpdate as Ke, encodeAwarenessUpdate as x } from "y-protocols/awareness";
import { Doc as qe, applyUpdate as S, encodeStateAsUpdate as Je } from "yjs";
import { withCollaboration as Ye } from "@blocknote/core/yjs";
import { Decoration as Xe, DecorationSet as Ze } from "prosemirror-view";
//#region src/blocks/adapters.ts
var Qe = n({}), $e = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function C() {
	return i($e);
}
var w = {
	change: "_change_zymrw_1",
	words: "_words_zymrw_12",
	dropped: "_dropped_zymrw_17",
	who: "_who_zymrw_23",
	stale: "_stale_zymrw_29",
	bar: "_bar_zymrw_35"
}, T = {
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
	return /* @__PURE__ */ h(ge, { children: e.map((e) => /* @__PURE__ */ h(tt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function tt({ review: e, host: t }) {
	return t ? he(/* @__PURE__ */ h(nt, { review: e }), t) : null;
}
function nt({ review: e }) {
	return /* @__PURE__ */ g("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: w.change,
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
		className: w.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function it({ review: e }) {
	return /* @__PURE__ */ g("p", {
		className: w.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: T.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: T.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function at({ change: e }) {
	let t = re(e);
	return t.length > 0 ? t.map((e, t) => /* @__PURE__ */ h("p", {
		className: w.words,
		children: e
	}, t)) : /* @__PURE__ */ h("p", {
		className: w.dropped,
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
	let t = e.getMeta(je);
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
	return e.map(se);
}
function E(e, t) {
	return fe(kt(e), t);
}
var D = {
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
	let r = !!e.props.replyTo, i = Bt(k(e));
	return /* @__PURE__ */ g("aside", {
		className: D.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${A(e)}`,
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
				className: D.text,
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
		className: D.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: D.author,
				children: A(e)
			}),
			/* @__PURE__ */ h("time", {
				className: D.when,
				children: Gt(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: D.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Ft({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: D.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ h(O, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, jt)
		}) : /* @__PURE__ */ h(It, {
			block: e,
			editor: t
		})
	});
}
function It({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ g(ge, { children: [n ? /* @__PURE__ */ h(Lt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(O, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(O, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, At)
	})] });
}
function O({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Lt({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = zt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: D.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h(Rt, {
			to: A(e),
			draft: r,
			onDraft: i
		})
	});
}
function Rt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: D.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function zt({ editor: e, block: t }) {
	let { user: n } = C(), r = v();
	return (i) => {
		if (!i) return;
		let a = k(t), o = r.document, s = Ht(o, a) ?? t;
		e.insertBlocks([Wt(a, i, n.name)], s, "after");
	};
}
function Bt(e) {
	let t = v(), n = () => Vt(t.document, e), [r, i] = d(n);
	return Ce(() => i(n())), r;
}
function Vt(e, t) {
	return e.some((e) => Ut(e) && k(e) === t && e.props.resolved === !0);
}
function Ht(e, t) {
	return e.filter((e) => e.type === "comment" && k(e) === t).at(-1);
}
function Ut(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function k(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function A(e) {
	return String(e.props.author || "Someone");
}
function Wt(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: m("cmt"),
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
var j = {
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
		className: j.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ g("figcaption", {
			className: j.label,
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
}, M = {
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
		className: M.steps,
		disabled: r
	};
	return /* @__PURE__ */ g("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ h("legend", {
			className: M.legend,
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
		className: M.step,
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
var N = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function $t({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ g("span", {
		className: N.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: N.label,
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
		className: N.input,
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
		className: j.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(on, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ h("div", {
			className: j.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function on({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: j.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: j.head,
			children: [/* @__PURE__ */ h("span", {
				className: j.label,
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
		className: j.link,
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
	let { propSchema: a } = f[e.type], o = a;
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
var P = {
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
	let r = oe(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: P.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(fn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: P.text,
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
		className: P.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ h("span", {
			className: P.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ g("p", {
		className: P.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: P.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ h("span", {
				className: P.why,
				children: e
			}),
			/* @__PURE__ */ h("span", {
				className: P.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function pn({ block: e, editor: t, options: n }) {
	return vn(L(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(mn, {
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
		className: P.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(hn, {
			onPick: () => F(t, e, n),
			children: n
		}) }, n))
	});
}
function hn({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: P.suggestion,
		onClick: e,
		children: t
	});
}
function gn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ g("form", {
		className: P.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), F(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(_n, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: P.answerButton,
			children: "Answer"
		})]
	});
}
function _n({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
		className: P.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function F(e, t, n) {
	if (!n) return;
	let r = L(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function vn(e) {
	let t = v(), [n, r] = d(() => I(t.document, e));
	return Ce(() => r(I(t.document, e))), n;
}
function I(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function L(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var R = n(null), z = n(/* @__PURE__ */ new Map());
function B(e) {
	let t = o(R), n = o(z).get(e);
	return t ? p(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var V = /* @__PURE__ */ new WeakMap();
function yn(e, t) {
	let n = xn(e);
	return l(() => {
		let n = Sn(e), r = le(n, t), i = He(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ue(r),
			proposal: i,
			preview: i?.status === "proposed" ? ce(n, i) : void 0,
			...bn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function bn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: pe(n),
			baseHash: Le(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Pe(e, t),
		applyAnyway: () => void Ie(e, t),
		discard: () => Be(e, t)
	};
}
function xn(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function Sn(e) {
	let t = V.get(e);
	if (t) return t;
	let n = Ue(e);
	return V.set(e, n), e.once("update", () => V.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Cn(e) {
	let t = yn(e.doc, e.slot), n = wn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ h(Dn, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ h(En, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ h(Tn, { ...r });
}
function wn({ slot: e, title: t }, n) {
	let { user: r, onRefine: i } = C();
	return () => {
		let a = n.ask(r.name);
		i?.({
			slot: e,
			title: t,
			...a
		}).catch(() => n.discard());
	};
}
function Tn({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ g("p", {
		className: T.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: T.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ h("span", {
			className: T.note,
			children: n ? `uses ${Mn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function En({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ g("p", {
		className: T.bar,
		role: "status",
		children: [/* @__PURE__ */ g("span", {
			className: T.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: T.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Dn({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ g("section", {
		className: T.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ g("p", {
				className: T.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					Nn(r)
				]
			}),
			/* @__PURE__ */ h(An, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ g("p", {
				className: T.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ h(On, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function On({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ g("p", {
		className: T.bar,
		children: [
			/* @__PURE__ */ h("button", {
				type: "button",
				className: T.refine,
				onClick: i,
				children: r
			}),
			n && /* @__PURE__ */ h(kn, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ h(kn, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function kn({ label: e, run: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: T.quiet,
		onClick: t,
		children: e
	});
}
function An({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: T.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: T[e.kind],
			children: /* @__PURE__ */ h(jn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function jn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
}
function Mn({ inputs: e }) {
	return Pn(e.answered.length, e.resolved.length);
}
function Nn({ uses: e }) {
	let t = Pn(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Pn(e, t) {
	return [Fn(e, "answer"), Fn(t, "resolved thread")].filter(Boolean).join(", ");
}
function Fn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var In = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function Ln({ block: e, editor: t }) {
	let { slot: n, title: r } = Rn(e), { onRefine: i, doc: a } = C();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: In.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Cn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function Rn(e) {
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
function zn({ block: e }) {
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
function Bn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = B(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: U.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Vn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function Vn({ block: e, editor: t, title: n }) {
	let { user: r } = C(), [i, a] = d("");
	return /* @__PURE__ */ g("form", {
		className: U.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(Un({
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
		}), /* @__PURE__ */ h(Hn, {})]
	});
}
function Hn() {
	return /* @__PURE__ */ h("button", {
		type: "submit",
		className: U.send,
		children: "Comment"
	});
}
function Un({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([Wn(n, r)], e, "before"), "");
}
function Wn(e, t) {
	return {
		type: "comment",
		props: {
			commentId: m("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var W = { render: an }, Gn = {
	"plan-title": _(f["plan-title"], { render: un })(),
	"section-heading": _(f["section-heading"], { render: zn })(),
	"section-panel": _(f["section-panel"], { render: Bn })(),
	"section-actions": _(f["section-actions"], { render: Ln })(),
	comment: _(f.comment, { render: Mt })(),
	kpi: _(f.kpi, W)(),
	prototype: _(f.prototype, W)(),
	mockup: _(f.mockup, { render: Kt })(),
	question: _(f.question, { render: dn })(),
	answer: _(f.answer, W)()
}, G = Te.create({ blockSpecs: {
	...Me,
	...Gn
} });
//#endregion
//#region src/menu/section-context.ts
function Kn(e, t) {
	let [n] = Jn(e, t);
	return n ? String(n.props.slot) : null;
}
function qn(e, t) {
	let n = Jn(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Jn(e, t) {
	let n = e.slice(0, Yn(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Yn(e, t) {
	return e.findIndex((e) => Xn(e, t));
}
function Xn(e, t) {
	return e.id === t || e.children.some((e) => Xn(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", Zn = { cells: [
	"",
	"",
	""
] }, Qn = [
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
			rows: [Zn, Zn]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: q,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: m("kpi") })
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
		props: () => ({ questionId: m("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: q,
		props: (e) => {
			let t = qn(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function $n(e, t) {
	return Qn.filter((t) => e.allows.includes(t.kind)).flatMap((e) => er(e, t));
}
function er(e, t) {
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
function tr() {
	let e = v(G), t = o(R);
	return /* @__PURE__ */ h(xe, {
		triggerCharacter: "/",
		getItems: async (n) => De(nr(e, t), n)
	});
}
function nr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && rr(t, i);
	return a ? $n(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Oe(e, Ot(t))
	})) : [];
}
function rr(e, { blocks: t, cursorId: n }) {
	let r = Kn(t, n);
	return r === null ? void 0 : p(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function ir(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => ar(e, t, n));
}
function ar(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ae(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function or(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var J = {
	outline: "_outline_juazx_1",
	phase: "_phase_juazx_8",
	slots: "_slots_juazx_15",
	title: "_title_juazx_22",
	required: "_required_juazx_26",
	problems: "_problems_juazx_30",
	footer: "_footer_juazx_36"
}, sr = [];
function cr({ template: e, report: t, sections: n = sr, children: r }) {
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
			/* @__PURE__ */ h(lr, {
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
function lr({ template: e, report: t, sections: n }) {
	let r = or(t.problems);
	return /* @__PURE__ */ h("ol", {
		className: J.slots,
		children: ir(e, n, t.phase).map((e) => /* @__PURE__ */ h(ur, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function ur({ section: e, problems: t }) {
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
	editor: "_editor_o6zst_1",
	withOutline: "_withOutline_o6zst_9",
	single: "_single_o6zst_13"
}, X = {
	bar: "_bar_xsz4f_1",
	user: "_user_xsz4f_14",
	dot: "_dot_xsz4f_20"
};
//#endregion
//#region src/presence/presence-users.ts
function dr(e, t) {
	return [...e].flatMap(([e, { user: n, editing: r }]) => e === t || !n ? [] : [fr(e, n, r)]);
}
function fr(e, t, n) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: pr(n)
	};
}
function pr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function mr(e, t, n) {
	let r = e.slot && p(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function hr(e) {
	let [t, n] = d(() => _r(e));
	return s(() => {
		let t = () => n(_r(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function gr(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: Kn(r, n.id) });
	}), [e, t]);
}
function _r(e) {
	return dr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/PresenceBar.tsx
function vr({ awareness: e, template: t, titles: n }) {
	let r = hr(e);
	return /* @__PURE__ */ h("ul", {
		className: X.bar,
		"aria-label": "Also editing",
		children: r.map((e) => /* @__PURE__ */ g("li", {
			className: X.user,
			children: [/* @__PURE__ */ h("svg", {
				className: X.dot,
				viewBox: "0 0 2 2",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h("circle", {
					cx: "1",
					cy: "1",
					r: "1",
					fill: e.color
				})
			}), mr(e, t, n)]
		}, e.clientId))
	});
}
var yr = { notice: "_notice_1xdcv_1" }, br = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: yr.notice,
		role: "status",
		"data-status": e,
		children: [br[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function xr(e, t) {
	let n = Cr(e, t);
	return l(() => Sr(e), [e, n]);
}
function Sr(e) {
	let t = new Set(We(e).map((e) => e.changeId));
	return Re(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Fe(e, n.changeId) : Ne(e, n.changeId),
		discard: () => ze(e, n.changeId)
	}));
}
function Cr(e, t) {
	let [n, r] = d(0), i = u(t);
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
function wr(e) {
	let t = new qe(), n = {
		doc: t,
		awareness: new Ge(t)
	}, r = Er({
		status: "connecting",
		meta: null
	});
	kr(n, e);
	let i = e.subscribe((e) => Or({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Tr(n, i)
	};
}
function Tr({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Er(e) {
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
var Dr = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		S(e, y(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => S(e, y(t), Q),
	awareness: ({ awareness: e }, { update: t }) => Ke(e, y(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Or(e, t) {
	Dr[t.type](e, t);
}
function kr({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: b(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = x(n, e(t));
		r.send({
			type: "awareness",
			update: b(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function Ar(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = wr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function jr(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Mr = new Ae("planChangeWidgets");
function Nr(e, t) {
	return Ee({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new ke({
			key: Mr,
			props: { decorations: (n) => Ze.create(n.doc, Pr(n, e, t)) }
		})]
	});
}
function Pr(e, t, n) {
	let r = Rr(e);
	return Re(t).flatMap((e) => {
		let t = Fr(r, e);
		return t === void 0 ? [] : [Ir(t, e, n)];
	});
}
function Fr(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ir(e, t, n) {
	return Xe.widget(e, () => Lr(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Lr(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Rr(e) {
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
function zr({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = Br(e, n, i), s = Vr(o, e, a((e) => r?.(E(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => E(s, t), [s, t]),
		hosts: i
	};
}
function Br(e, t, n) {
	let { doc: r } = e;
	return Se(Ye({
		schema: G,
		extensions: [ut, Nr(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(ne),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function Vr(e, t, n) {
	let [r, i] = d(() => Ue(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Hr = {};
function Ur({ transport: e, adapters: t = Hr, className: n, ...r }) {
	let i = Ar(e);
	return /* @__PURE__ */ h(Qe, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: Wr({
				...r,
				className: n
			}),
			children: i ? /* @__PURE__ */ h(Gr, {
				...r,
				session: i
			}) : /* @__PURE__ */ h(Z, { status: "connecting" })
		})
	});
}
function Wr({ showOutline: e, className: t }) {
	let n = e === !1 ? Y.single : Y.withOutline;
	return [
		Y.editor,
		n,
		"ps-editor",
		t
	].filter(Boolean).join(" ");
}
function Gr({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = jr(t.session);
	if (!r) return /* @__PURE__ */ h(Z, {
		status: n,
		reason: i
	});
	let a = e ?? de(r.type);
	return /* @__PURE__ */ g(R, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ h(Z, {
			status: n,
			reason: i
		}), /* @__PURE__ */ h(Kr, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Kr({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = zr(r), l = qr(i, o, c), u = Qr(s, e, t);
	return gr(o, i.awareness), /* @__PURE__ */ h($e, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(Jr, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function qr(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Jr({ showOutline: e = !0, showPresence: t = !0, ...n }) {
	let r = Yr(n.sections);
	return /* @__PURE__ */ g(z, {
		value: r,
		children: [
			t && /* @__PURE__ */ h(vr, {
				...n,
				titles: r
			}),
			/* @__PURE__ */ h(Zr, { ...n }),
			e && /* @__PURE__ */ h(Xr, { ...n })
		]
	});
}
function Yr(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function Xr({ template: e, report: t, sections: n, outlineFooter: r }) {
	return /* @__PURE__ */ h(cr, {
		template: e,
		report: t,
		sections: n,
		children: r
	});
}
function Zr({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = xr(n, () => $r(e));
	return /* @__PURE__ */ g(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ h(tr, {}),
			/* @__PURE__ */ h(xt, {}),
			/* @__PURE__ */ h(et, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Qr(e, t, n) {
	let r = l(() => me(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function $r(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ei(e) {
	let t = Ve(e.blocks), n = new Ge(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return ni(r), {
		doc: t,
		connect: () => ii(r)
	};
}
function ti(e) {
	return ei(e).connect();
}
function ni(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => ri(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		ri(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function ri(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function ii(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ai(e, t, n),
		subscribe: (n) => (t.handlers.add(n), oi(e, n), () => t.handlers.delete(n))
	};
}
function ai(e, t, n) {
	if (n.type === "update") {
		S(e.doc, y(n.update), t);
		return;
	}
	Ke(e.awareness, y(n.update), t);
}
function oi({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: b(Je(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = x(t, i);
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
}, si = {
	kept: " ",
	added: "+",
	removed: "-"
};
function ci({ before: e, after: t, className: n }) {
	let r = ie(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ h(li, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(ui, { section: e }, e.slot)),
			/* @__PURE__ */ h(di, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function li({ changes: e }) {
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
function ui({ section: e }) {
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
					children: [si[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function di({ what: e, changes: t }) {
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
export { ci as PlanDiffView, Ur as PlanEditor, dt as bypassTemplate, ei as createMemoryHub, kt as fromEditorBlocks, ti as localTransport, G as planSchema, E as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map