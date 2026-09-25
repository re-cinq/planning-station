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
import { Awareness as Ke, applyAwarenessUpdate as qe, encodeAwarenessUpdate as x } from "y-protocols/awareness";
import { Doc as Je, applyUpdate as S, encodeStateAsUpdate as Ye } from "yjs";
import { withCollaboration as Xe } from "@blocknote/core/yjs";
import { Decoration as Ze, DecorationSet as Qe } from "prosemirror-view";
//#region src/blocks/adapters.ts
var $e = n({}), et = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function C() {
	return i(et);
}
var w = {
	change: "_change_zymrw_1",
	words: "_words_zymrw_12",
	dropped: "_dropped_zymrw_17",
	who: "_who_zymrw_23",
	stale: "_stale_zymrw_29",
	bar: "_bar_zymrw_35"
}, T = {
	bar: "_bar_1mg4k_1",
	note: "_note_1mg4k_9",
	refine: "_refine_1mg4k_14",
	quiet: "_quiet_1mg4k_38",
	proposal: "_proposal_1mg4k_54",
	stale: "_stale_1mg4k_64",
	failed: "_failed_1mg4k_65",
	lines: "_lines_1mg4k_71",
	kept: "_kept_1mg4k_79",
	added: "_added_1mg4k_83",
	removed: "_removed_1mg4k_87"
};
//#endregion
//#region src/blocks/InlineChanges.tsx
function tt({ changes: e, hosts: t }) {
	return /* @__PURE__ */ h(m, { children: e.map((e) => /* @__PURE__ */ h(nt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function nt({ review: e, host: t }) {
	return t ? ge(/* @__PURE__ */ h(rt, { review: e }), t) : null;
}
function rt({ review: e }) {
	return /* @__PURE__ */ g("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: w.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h(st, { change: e.change }),
			e.stale && /* @__PURE__ */ h(it, {}),
			/* @__PURE__ */ h(at, { review: e })
		]
	});
}
function it() {
	return /* @__PURE__ */ h("p", {
		className: w.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function at({ review: e }) {
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
var ot = {
	"remove-block": "This paragraph goes.",
	"set-section-text": "This section is cleared.",
	"set-section-prose": "This section is cleared."
};
function st({ change: e }) {
	let t = ie(e), n = ot[e.op.op];
	return t.length === 0 && n ? /* @__PURE__ */ h("p", {
		className: w.dropped,
		children: n
	}) : t.map((e, t) => /* @__PURE__ */ h("p", {
		className: w.words,
		children: e
	}, t));
}
//#endregion
//#region src/template/template-guard.ts
var ct = "planTemplateBypass", lt = "section-heading", ut = "blockContent", dt = [
	"plan-title",
	lt,
	"section-panel",
	"section-actions"
], ft = Ee({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new ke({ filterTransaction: mt })]
});
function pt(e, t) {
	return e.setMeta(ct, t);
}
function mt(e, t) {
	if (!e.docChanged || ht(e)) return !0;
	let n = gt(t.doc), r = gt(e.doc);
	return xt(vt(n), vt(r)) && yt(n, r);
}
function ht(e) {
	let t = e.getMeta(Me);
	return !!e.getMeta(ct) || t?.isChangeOrigin === !0;
}
function gt(e) {
	let t = [];
	return e.descendants((e) => {
		_t(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function _t(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(ut);
}
function vt(e) {
	return e.filter((e) => dt.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function yt(e, t) {
	return bt(t) === 0 || bt(e) > 0;
}
function bt(e) {
	let t = e.findIndex((e) => e.type === lt);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function xt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var St = { useFloatingOptions: {
	placement: "left-start",
	middleware: [_e(({ elements: e, rects: t }) => {
		let n = Tt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Ct() {
	return /* @__PURE__ */ h(be, {
		floatingUIOptions: St,
		sideMenu: wt
	});
}
function wt() {
	let e = we(ve, { selector: (e) => e?.block.type });
	return e === void 0 || dt.includes(e) ? null : /* @__PURE__ */ h(ye, {});
}
function Tt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Et(t) : null;
}
function Et(e) {
	let t = Dt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Dt(e) {
	let t = Ot(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && kt(n);
}
function Ot(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function kt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function At(e) {
	return e;
}
function jt(e) {
	return e.map(ce);
}
function E(e, t) {
	return pe(jt(e), t);
}
var D = {
	comment: "_comment_1yef1_1",
	text: "_text_1yef1_23",
	who: "_who_1yef1_27",
	author: "_author_1yef1_36",
	when: "_when_1yef1_40",
	badge: "_badge_1yef1_44",
	actions: "_actions_1yef1_54",
	reply: "_reply_1yef1_76",
	confirm: "_confirm_1yef1_80",
	question: "_question_1yef1_92",
	input: "_input_1yef1_98"
}, Mt = { props: { resolved: !0 } }, Nt = { props: { resolved: !1 } };
function Pt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = qt(A(e));
	return /* @__PURE__ */ g("aside", {
		className: D.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${j(e)}`,
		...It({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ h(Lt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ h("div", {
				className: D.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ h(Ft, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Ft({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: D.actions,
		contentEditable: !1,
		children: [k(e) && /* @__PURE__ */ h(Rt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ h(zt, {
			block: e,
			editor: t
		})]
	});
}
function It({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Lt({ block: e, resolved: t }) {
	return /* @__PURE__ */ g("p", {
		className: D.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: D.author,
				children: j(e)
			}),
			/* @__PURE__ */ h("time", {
				className: D.when,
				children: Zt(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: D.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Rt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ h(O, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Nt)
	}) : /* @__PURE__ */ h(Ut, {
		block: e,
		editor: t
	});
}
function zt({ block: e, editor: t }) {
	let [n, r] = u(!1), i = Ht(e);
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h(O, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ h(Bt, {
		question: Vt(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function Bt({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ g("div", {
		className: D.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("p", {
				className: D.question,
				children: e
			}),
			/* @__PURE__ */ h(O, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ h(O, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function Vt(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function Ht(e) {
	let t = v();
	if (!k(e)) return [e];
	let n = A(e);
	return t.document.filter((e) => e.type === "comment" && A(e) === n);
}
function Ut({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ g(m, { children: [n ? /* @__PURE__ */ h(Wt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(O, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(O, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Mt)
	})] });
}
function O({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Wt({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = Kt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: D.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h(Gt, {
			to: j(e),
			draft: r,
			onDraft: i
		})
	});
}
function Gt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: D.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function Kt({ editor: e, block: t }) {
	let { user: n } = C(), r = v();
	return (i) => {
		if (!i) return;
		let a = A(t), o = r.document, s = Yt(o, a) ?? t;
		e.insertBlocks([Xt(a, i, n.name)], s, "after");
	};
}
function qt(e) {
	let t = v(), n = () => Jt(t.document, e), [r, i] = u(n);
	return Ce(() => i(n())), r;
}
function Jt(e, t) {
	return e.some((e) => k(e) && A(e) === t && e.props.resolved === !0);
}
function Yt(e, t) {
	return e.filter((e) => e.type === "comment" && A(e) === t).at(-1);
}
function k(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function A(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function j(e) {
	return String(e.props.author || "Someone");
}
function Xt(e, t, n) {
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
function Zt(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var M = {
	finding: "_finding_d6sjh_1",
	who: "_who_d6sjh_24",
	label: "_label_d6sjh_37",
	why: "_why_d6sjh_41",
	text: "_text_d6sjh_45",
	actions: "_actions_d6sjh_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function Qt({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ g("aside", {
		className: M.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": tn(r),
		children: [
			/* @__PURE__ */ h($t, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ h("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ h(en, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function $t({ severity: e, why: t }) {
	return /* @__PURE__ */ g("p", {
		className: M.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("span", {
			className: M.label,
			children: tn(e)
		}), t && /* @__PURE__ */ h("span", {
			className: M.why,
			children: t
		})]
	});
}
function en({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: M.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ h("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function tn(e) {
	return `Finding · ${e}`;
}
var N = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function nn({ block: e }) {
	let { renderMockup: t } = o($e);
	return /* @__PURE__ */ g("figure", {
		className: N.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ g("figcaption", {
			className: N.label,
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
var rn = {
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
}, P = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, an = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function on({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: P.steps,
		disabled: r
	};
	return /* @__PURE__ */ g("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ h("legend", {
			className: P.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ h(sn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function sn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ g("label", {
		className: P.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ h("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), an[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var cn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function ln(e, t) {
	return e[String(t)] ?? String(t);
}
var F = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function un({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ g("span", {
		className: F.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: F.label,
			htmlFor: n,
			children: ln(cn, e)
		}), /* @__PURE__ */ h(dn, {
			...t,
			id: n
		})]
	});
}
function dn(e) {
	return e.spec.values ? /* @__PURE__ */ h(fn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ h(pn, { ...e });
}
function fn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ h("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ h("option", { children: e }, e))
	});
}
function pn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ h("input", {
		id: e,
		className: F.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var mn = { maturity: on };
function hn({ block: e, editor: t, contentRef: n }) {
	let r = rn[e.type];
	return /* @__PURE__ */ g("div", {
		className: N.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(gn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ h("div", {
			className: N.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function gn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: N.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: N.head,
			children: [/* @__PURE__ */ h("span", {
				className: N.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ h(_n, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ h(vn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function _n({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ g("a", {
		className: N.link,
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
function vn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(mn[n] ?? un, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var yn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function bn({ contentRef: e }) {
	return /* @__PURE__ */ h("h1", {
		className: yn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var I = {
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
function xn({ block: e, editor: t, contentRef: n }) {
	let r = se(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: I.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(Sn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: I.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ h(Cn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Sn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ h("p", {
		className: I.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ h("span", {
			className: I.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ g("p", {
		className: I.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: I.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ h("span", {
				className: I.why,
				children: e
			}),
			/* @__PURE__ */ h("span", {
				className: I.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Cn({ block: e, editor: t, options: n }) {
	return kn(jn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(wn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ h(En, {
		block: e,
		editor: t
	});
}
function wn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ h("ul", {
		className: I.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(Tn, {
			onPick: () => On(t, e, n),
			children: n
		}) }, n))
	});
}
function Tn({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: I.suggestion,
		onClick: e,
		children: t
	});
}
function En({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ g("form", {
		className: I.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), On(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(Dn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: I.answerButton,
			children: "Answer"
		})]
	});
}
function Dn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
		className: I.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function On(e, t, n) {
	if (!n) return;
	let r = jn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function kn(e) {
	let t = v(), [n, r] = u(() => An(t.document, e));
	return Ce(() => r(An(t.document, e))), n;
}
function An(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function jn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var L = n(null), Mn = n(/* @__PURE__ */ new Map());
function R(e) {
	let t = o(L), n = o(Mn).get(e);
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var z = /* @__PURE__ */ new WeakMap();
function Nn(e, t) {
	let n = Fn(e);
	return l(() => {
		let n = In(e), r = ue(n, t), i = Ue(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: de(r),
			proposal: i,
			preview: i?.status === "proposed" ? le(n, i) : void 0,
			...Pn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Pn(e, t, n) {
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
function Fn(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function In(e) {
	let t = z.get(e);
	if (t) return t;
	let n = We(e);
	return z.set(e, n), e.once("update", () => z.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Ln(e) {
	let t = Nn(e.doc, e.slot), n = zn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal ? /* @__PURE__ */ h(Rn, {
		...r,
		proposal: t.proposal
	}) : /* @__PURE__ */ h(Bn, { ...r });
}
function Rn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ h(Vn, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ h(Hn, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ h(Un, {
			...t,
			proposal: e
		});
	}
}
function zn({ slot: e, title: t }, n) {
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
function Bn({ refine: e, ask: t }) {
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
			children: n ? `uses ${qn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Vn({ refine: e, askedBy: t }) {
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
function Hn({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ g("section", {
		className: T.proposal,
		children: [/* @__PURE__ */ g("p", {
			className: T.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ g("p", {
			className: T.bar,
			children: [/* @__PURE__ */ h("button", {
				type: "button",
				className: T.refine,
				onClick: t,
				children: "Ask again"
			}), /* @__PURE__ */ h(B, {
				label: "Dismiss",
				run: e.discard
			})]
		})]
	});
}
function Un({ refine: e, ask: t, title: n, proposal: r }) {
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
					Jn(r)
				]
			}),
			/* @__PURE__ */ h(Gn, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ h(Wn, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function Wn({ refine: e, ask: t, stale: n }) {
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
			n && /* @__PURE__ */ h(B, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ h(B, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function B({ label: e, run: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: T.quiet,
		onClick: t,
		children: e
	});
}
function Gn({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: T.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: T[e.kind],
			children: /* @__PURE__ */ h(Kn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function Kn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
}
function qn({ inputs: e }) {
	return Yn(e.answered.length, e.resolved.length);
}
function Jn({ uses: e }) {
	let t = Yn(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Yn(e, t) {
	return [Xn(e, "answer"), Xn(t, "resolved thread")].filter(Boolean).join(", ");
}
function Xn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var Zn = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function Qn({ block: e, editor: t }) {
	let { slot: n, title: r } = $n(e), { onRefine: i, doc: a } = C();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: Zn.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Ln, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function $n(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: R(t)?.title ?? t
	};
}
var V = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function er({ block: e }) {
	let t = R(e.props.slot);
	return /* @__PURE__ */ g("header", {
		className: V.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("h2", {
			className: V.title,
			children: e.props.title
		}), t && /* @__PURE__ */ h("p", {
			className: V.hint,
			children: t.hint
		})]
	});
}
var H = {
	panel: "_panel_1ajor_1",
	commentBox: "_commentBox_1ajor_11",
	input: "_input_1ajor_17",
	send: "_send_1ajor_34"
};
//#endregion
//#region src/blocks/SectionPanel.tsx
function tr({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = R(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(nr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function nr({ block: e, editor: t, title: n }) {
	let { user: r } = C(), [i, a] = u("");
	return /* @__PURE__ */ g("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(ir({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ h("input", {
			className: H.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ h(rr, {})]
	});
}
function rr() {
	return /* @__PURE__ */ h("button", {
		type: "submit",
		className: H.send,
		children: "Comment"
	});
}
function ir({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([ar(n, r)], e, "before"), "");
}
function ar(e, t) {
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
var U = { render: hn }, or = {
	"plan-title": _(d["plan-title"], { render: bn })(),
	"section-heading": _(d["section-heading"], { render: er })(),
	"section-panel": _(d["section-panel"], { render: tr })(),
	"section-actions": _(d["section-actions"], { render: Qn })(),
	comment: _(d.comment, { render: Pt })(),
	finding: _(d.finding, { render: Qt })(),
	kpi: _(d.kpi, U)(),
	prototype: _(d.prototype, U)(),
	mockup: _(d.mockup, { render: nn })(),
	question: _(d.question, { render: xn })(),
	answer: _(d.answer, U)()
}, W = Te.create({ blockSpecs: {
	...Ne,
	...or
} });
//#endregion
//#region src/menu/section-context.ts
function sr(e, t) {
	let [n] = lr(e, t);
	return n ? String(n.props.slot) : null;
}
function cr(e, t) {
	let n = lr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function lr(e, t) {
	let n = e.slice(0, ur(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function ur(e, t) {
	return e.findIndex((e) => dr(e, t));
}
function dr(e, t) {
	return e.id === t || e.children.some((e) => dr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", fr = { cells: [
	"",
	"",
	""
] }, pr = [
	{
		kind: "paragraph",
		title: "Paragraph",
		group: G,
		aliases: ["p"]
	},
	{
		kind: "heading",
		title: "Heading",
		group: G,
		aliases: ["h2"],
		props: () => ({ level: 2 })
	},
	{
		kind: "heading",
		title: "Subheading",
		group: G,
		aliases: ["h3"],
		props: () => ({ level: 3 })
	},
	{
		kind: "bulletListItem",
		title: "Bullet list",
		group: G,
		aliases: ["ul"]
	},
	{
		kind: "numberedListItem",
		title: "Numbered list",
		group: G,
		aliases: ["ol"]
	},
	{
		kind: "checkListItem",
		title: "Checklist",
		group: G,
		aliases: ["todo"]
	},
	{
		kind: "quote",
		title: "Quote",
		group: G
	},
	{
		kind: "codeBlock",
		title: "Code",
		group: G
	},
	{
		kind: "table",
		title: "Table",
		group: G,
		content: {
			type: "tableContent",
			rows: [fr, fr]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: p("kpi") })
	},
	{
		kind: "prototype",
		title: "Prototype",
		group: K
	},
	{
		kind: "mockup",
		title: "Mockup",
		group: K
	},
	{
		kind: "question",
		title: "Question",
		group: K,
		props: () => ({ questionId: p("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = cr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function mr(e, t) {
	return pr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => hr(e, t));
}
function hr(e, t) {
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
function gr() {
	let e = v(W), t = o(L);
	return /* @__PURE__ */ h(xe, {
		triggerCharacter: "/",
		getItems: async (n) => De(_r(e, t), n)
	});
}
function _r(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && vr(t, i);
	return a ? mr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Oe(e, At(t))
	})) : [];
}
function vr(e, { blocks: t, cursorId: n }) {
	let r = sr(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function yr(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => br(e, t, n));
}
function br(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && oe(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function xr(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var q = {
	outline: "_outline_su1wu_1",
	phase: "_phase_su1wu_6",
	slots: "_slots_su1wu_13",
	title: "_title_su1wu_20",
	required: "_required_su1wu_24",
	problems: "_problems_su1wu_28",
	footer: "_footer_su1wu_34"
}, Sr = [];
function Cr({ template: e, report: t, sections: n = Sr, approval: r = null, children: i }) {
	return /* @__PURE__ */ g("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ h("p", {
				className: q.phase,
				children: r ? Tr(r) : wr(t)
			}),
			/* @__PURE__ */ h(Dr, {
				template: e,
				report: t,
				sections: n
			}),
			i && /* @__PURE__ */ h("div", {
				className: q.footer,
				children: i
			})
		]
	});
}
function wr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function Tr({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Er(t)}`;
}
function Er(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Dr({ template: e, report: t, sections: n }) {
	let r = xr(t.problems);
	return /* @__PURE__ */ h("ol", {
		className: q.slots,
		children: yr(e, n, t.phase).map((e) => /* @__PURE__ */ h(Or, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Or({ section: e, problems: t }) {
	return /* @__PURE__ */ g("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ h("span", {
				className: q.title,
				children: e.title
			}),
			e.required && /* @__PURE__ */ h("span", {
				className: q.required,
				children: " required"
			}),
			/* @__PURE__ */ h("ul", {
				className: q.problems,
				children: t.map((e) => /* @__PURE__ */ h("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var J = {
	editor: "_editor_19wtq_1",
	withSidebar: "_withSidebar_19wtq_9",
	single: "_single_19wtq_13",
	sidebar: "_sidebar_19wtq_17"
}, Y = {
	participants: "_participants_64cvt_1",
	locate: "_locate_64cvt_16",
	away: "_away_64cvt_17",
	dot: "_dot_64cvt_38"
};
//#endregion
//#region src/presence/presence-users.ts
function kr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Ar(e, n)]);
}
function Ar(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: jr(n),
		hasCursor: r != null
	};
}
function jr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Mr(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function Nr(e) {
	let [t, n] = u(() => X(e));
	return s(() => {
		let t = () => n(X(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function Pr(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: sr(r, n.id) });
	}), [e, t]);
}
function X(e) {
	return kr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function Fr({ awareness: e, ...t }) {
	let n = Nr(e);
	return n.length === 0 ? null : /* @__PURE__ */ h("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(Ir, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function Ir({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Mr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ h("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: Lr,
		onClick: () => r(e),
		children: /* @__PURE__ */ h(Rr, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ h("span", {
		className: Y.away,
		children: /* @__PURE__ */ h(Rr, {
			color: e.color,
			label: i
		})
	});
}
function Lr(e) {
	e.preventDefault();
}
function Rr({ color: e, label: t }) {
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("svg", {
		className: Y.dot,
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
function zr(e, t) {
	let n = e.prosemirrorView, r = Br(n, t);
	r !== null && Vr(n, r)?.scrollIntoView({ block: "center" });
}
function Br(e, t) {
	let [n] = je.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Vr(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Hr = { notice: "_notice_1xdcv_1" }, Ur = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: Hr.notice,
		role: "status",
		"data-status": e,
		children: [Ur[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Wr(e, t) {
	let n = Kr(e, t);
	return l(() => Gr(e), [e, n]);
}
function Gr(e) {
	let t = new Set(Ge(e).map((e) => e.changeId));
	return ze(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Ie(e, n.changeId) : Pe(e, n.changeId),
		discard: () => Be(e, n.changeId)
	}));
}
function Kr(e, t) {
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
function qr(e) {
	let t = new Je(), n = {
		doc: t,
		awareness: new Ke(t)
	}, r = Yr({
		status: "connecting",
		meta: null
	});
	Qr(n, e);
	let i = e.subscribe((e) => Zr({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Jr(n, i)
	};
}
function Jr({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Yr(e) {
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
var Xr = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		S(e, y(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => S(e, y(t), Q),
	awareness: ({ awareness: e }, { update: t }) => qe(e, y(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Zr(e, t) {
	Xr[t.type](e, t);
}
function Qr({ doc: t, awareness: n }, r) {
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
function $r(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = qr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function ei(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var ti = new Ae("planChangeWidgets");
function ni(e, t) {
	return Ee({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new ke({
			key: ti,
			props: { decorations: (n) => Qe.create(n.doc, ri(n, e, t)) }
		})]
	});
}
function ri(e, t, n) {
	let r = si(e);
	return ze(t).flatMap((e) => {
		let t = ii(r, e);
		return t === void 0 ? [] : [ai(t, e, n)];
	});
}
function ii(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function ai(e, t, n) {
	return Ze.widget(e, () => oi(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function oi(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function si(e) {
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
function ci({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = li(e, n, i), s = ui(o, e, a((e) => r?.(E(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => E(s, t), [s, t]),
		hosts: i
	};
}
function li(e, t, n) {
	let { doc: r } = e;
	return Se(Xe({
		schema: W,
		extensions: [ft, ni(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function ui(e, t, n) {
	let [r, i] = u(() => We(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var di = {};
function fi({ transport: e, adapters: t = di, className: n, ...r }) {
	let i = $r(e), a = pi(r);
	return /* @__PURE__ */ h($e, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: mi({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ h(hi, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ h(Z, { status: "connecting" })
		})
	});
}
function pi({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function mi({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function hi({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = ei(t.session);
	if (!r) return /* @__PURE__ */ h(Z, {
		status: n,
		reason: i
	});
	let a = e ?? fe(r.type);
	return /* @__PURE__ */ g(L, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ h(Z, {
			status: n,
			reason: i
		}), /* @__PURE__ */ h(gi, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function gi({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = ci(r), l = _i(i, o, c), ee = wi(s, e, t);
	return Pr(o, i.awareness), /* @__PURE__ */ h(et, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(vi, {
			...r,
			...l,
			...s,
			report: ee
		})
	});
}
function _i(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function vi(e) {
	let t = bi(e.sections);
	return /* @__PURE__ */ g(Mn, {
		value: t,
		children: [/* @__PURE__ */ h(Ci, { ...e }), /* @__PURE__ */ h(yi, {
			...e,
			titles: t
		})]
	});
}
function yi({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ g("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ h(xi, { ...n }), t && /* @__PURE__ */ h(Si, { ...n })]
	});
}
function bi(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function xi({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ h(Fr, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => zr(e, t.clientId)
	});
}
function Si({ meta: e, outlineFooter: t, ...n }) {
	return /* @__PURE__ */ h(Cr, {
		...n,
		approval: e.approval,
		children: t
	});
}
function Ci({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Wr(n, () => Ti(e));
	return /* @__PURE__ */ g(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ h(gr, {}),
			/* @__PURE__ */ h(Ct, {}),
			/* @__PURE__ */ h(tt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function wi(e, t, n) {
	let r = l(() => he(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Ti(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function Ei(e) {
	let t = He(e.blocks), n = new Ke(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Oi(r), {
		doc: t,
		connect: () => Ai(r)
	};
}
function Di(e) {
	return Ei(e).connect();
}
function Oi(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => ki(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		ki(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function ki(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Ai(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ji(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Mi(e, n), () => t.handlers.delete(n))
	};
}
function ji(e, t, n) {
	if (n.type === "update") {
		S(e.doc, y(n.update), t);
		return;
	}
	qe(e.awareness, y(n.update), t);
}
function Mi({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: b(Ye(e))
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
}, Ni = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Pi({ before: e, after: t, className: n }) {
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
			/* @__PURE__ */ h(Fi, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(Ii, { section: e }, e.slot)),
			/* @__PURE__ */ h(Li, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Fi({ changes: e }) {
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
function Ii({ section: e }) {
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
					children: [Ni[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Li({ what: e, changes: t }) {
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
export { Pi as PlanDiffView, fi as PlanEditor, pt as bypassTemplate, Ei as createMemoryHub, jt as fromEditorBlocks, Di as localTransport, W as planSchema, E as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map