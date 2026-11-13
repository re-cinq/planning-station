import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { MARGIN_NOTES as f, NOT_CONTENT as ne, PLAN_BLOCK_CONFIGS as p, PLAN_FRAGMENT as re, SECTION_ACTIONS as m, applyOps as ie, changeWords as ae, diffPlans as oe, findSectionSlot as se, isMeaningful as ce, isPlanBlock as le, isRemovableSlot as ue, isRequiredAt as de, newId as h, optionsOf as fe, parseBlock as pe, partitionSections as me, plainText as he, previewProposal as ge, refineInputs as _e, settledBySlot as ve, settledCount as ye, tableCells as be, templateFor as xe, toBlocks as Se, toPlanDocument as Ce, usesOf as we, validatePlan as Te } from "@re-cinq/planning-document";
import { createPortal as Ee } from "react-dom";
import { Fragment as g, jsx as _, jsxs as v } from "react/jsx-runtime";
import { offset as De } from "@floating-ui/react";
import { SideMenuExtension as Oe } from "@blocknote/core/extensions";
import { SideMenu as ke, SideMenuController as Ae, SuggestionMenuController as je, createReactBlockSpec as y, useBlockNoteEditor as b, useCreateBlockNote as Me, useEditorChange as Ne, useExtensionState as Pe } from "@blocknote/react";
import { BlockNoteSchema as Fe, createExtension as x, filterSuggestionItems as Ie, insertOrUpdateBlockForSlashMenu as Le } from "@blocknote/core";
import { NodeSelection as S, Plugin as C, PluginKey as Re, TextSelection as ze } from "prosemirror-state";
import { yCursorPluginKey as Be, ySyncPluginKey as Ve } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as He, acceptChange as Ue, acceptRefine as We, applyChangeAnyway as Ge, applyOpsToDoc as Ke, applyRefineAnyway as qe, askRefine as Je, changesIn as Ye, discardChange as Xe, discardRefine as Ze, docFromBlocks as Qe, fromBase64 as w, proposalsIn as $e, readBlocks as et, staleChanges as tt, toBase64 as T } from "@re-cinq/planning-yjs";
import { Awareness as nt, applyAwarenessUpdate as rt, encodeAwarenessUpdate as it } from "y-protocols/awareness";
import { Doc as at, applyUpdate as ot, encodeStateAsUpdate as st } from "yjs";
import { withCollaboration as ct } from "@blocknote/core/yjs";
import { Decoration as lt, DecorationSet as ut } from "prosemirror-view";
//#region src/blocks/adapters.ts
var dt = n({}), ft = n({ user: {
	id: "",
	name: "Someone"
} });
function E() {
	return i(ft);
}
var D = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
}, O = {
	bar: "_bar_2qfu0_1",
	note: "_note_2qfu0_9",
	hint: "_hint_2qfu0_14",
	refine: "_refine_2qfu0_20",
	quiet: "_quiet_2qfu0_44",
	proposal: "_proposal_2qfu0_61",
	stale: "_stale_2qfu0_71",
	failed: "_failed_2qfu0_72",
	lines: "_lines_2qfu0_78",
	kept: "_kept_2qfu0_86",
	added: "_added_2qfu0_90",
	removed: "_removed_2qfu0_94"
};
//#endregion
//#region src/blocks/InlineChanges.tsx
function pt({ changes: e, hosts: t }) {
	return /* @__PURE__ */ _(g, { children: e.map((e) => /* @__PURE__ */ _(mt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function mt({ review: e, host: t }) {
	return t ? Ee(/* @__PURE__ */ _(ht, { review: e }), t) : null;
}
function ht({ review: e }) {
	return /* @__PURE__ */ v("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: D.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(vt, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ _(gt, {}),
			/* @__PURE__ */ _(_t, { review: e })
		]
	});
}
function gt() {
	return /* @__PURE__ */ _("p", {
		className: D.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function _t({ review: e }) {
	return /* @__PURE__ */ v("p", {
		className: D.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: O.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: O.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function vt({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ _(yt, { removal: t }) : ae(e).map((e, t) => /* @__PURE__ */ _("p", {
		className: D.words,
		children: e
	}, t));
}
function yt({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : xt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ _("p", {
		className: D.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _("p", {
		className: D.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ _("p", {
		className: D.dropped,
		children: /* @__PURE__ */ _("del", { children: e })
	}, t))] });
}
var bt = {
	paragraph: "paragraph",
	heading: "heading",
	bulletListItem: "item",
	numberedListItem: "item",
	checkListItem: "item",
	quote: "quote",
	codeBlock: "code block",
	table: "table",
	question: "question",
	answer: "answer",
	comment: "comment",
	finding: "finding",
	kpi: "KPI",
	prototype: "prototype"
};
function xt(e) {
	return bt[e] ?? "block";
}
//#endregion
//#region src/template/template-guard.ts
var St = "planTemplateBypass", k = "section-heading", Ct = "blockContent", A = [
	"plan-title",
	k,
	"section-panel",
	m
], wt = x({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new C({ filterTransaction: Et })]
});
function Tt(e, t) {
	return e.setMeta(St, t);
}
function Et(e, t) {
	if (!e.docChanged || Dt(e)) return !0;
	let n = Ot(t.doc), r = Ot(e.doc);
	return Lt(At(n), At(r)) && jt(n, r) && Nt(n, r);
}
function Dt(e) {
	let t = e.getMeta(Ve);
	return !!e.getMeta(St) || t?.isChangeOrigin === !0;
}
function Ot(e) {
	let t = [];
	return e.descendants((e) => {
		kt(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function kt(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(Ct);
}
function At(e) {
	return e.filter((e) => A.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function jt(e, t) {
	return Mt(t) === 0 || Mt(e) > 0;
}
function Mt(e) {
	let t = e.findIndex((e) => e.type === k);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Nt(e, t) {
	let n = Ft(e);
	return [...Ft(t)].every(([e, t]) => t <= (n.get(e) ?? 0));
}
var Pt = [...f, "answer"];
function Ft(e) {
	let t = /* @__PURE__ */ new Map();
	return e.reduce((e, n) => n.type === k ? {
		slot: n.slot,
		closed: !1
	} : (e.closed && !Pt.includes(n.type) && t.set(e.slot, (t.get(e.slot) ?? 0) + 1), {
		slot: e.slot,
		closed: e.closed || It(n)
	}), {
		slot: "",
		closed: !1
	}), t;
}
function It(e) {
	return e.type === m;
}
function Lt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Rt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [De(({ elements: e, rects: t }) => {
		let n = Vt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function zt() {
	return /* @__PURE__ */ _(Ae, {
		floatingUIOptions: Rt,
		sideMenu: Bt
	});
}
function Bt() {
	let e = Pe(Oe, { selector: (e) => e?.block.type });
	return e === void 0 || A.includes(e) ? null : /* @__PURE__ */ _(ke, {});
}
function Vt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Ht(t) : null;
}
function Ht(e) {
	let t = Ut(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Ut(e) {
	let t = Wt(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Gt(n);
}
function Wt(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Gt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Kt(e) {
	return e;
}
function qt(e) {
	return e.map(pe);
}
function j(e, t) {
	return Ce(qt(e), t);
}
var M = {
	comment: "_comment_u78gw_1",
	text: "_text_u78gw_23",
	who: "_who_u78gw_27",
	author: "_author_u78gw_36",
	when: "_when_u78gw_40",
	badge: "_badge_u78gw_44",
	actions: "_actions_u78gw_54",
	reply: "_reply_u78gw_80",
	confirm: "_confirm_u78gw_84",
	question: "_question_u78gw_114",
	input: "_input_u78gw_120"
}, Jt = { props: { resolved: !0 } }, Yt = { props: { resolved: !1 } };
function Xt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = un(F(e));
	return /* @__PURE__ */ v("aside", {
		className: M.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${I(e)}`,
		...Qt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ _($t, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ _("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ _(Zt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Zt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ v("div", {
		className: M.actions,
		contentEditable: !1,
		children: [P(e) && /* @__PURE__ */ _(en, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ _(tn, {
			block: e,
			editor: t
		})]
	});
}
function Qt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function $t({ block: e, resolved: t }) {
	return /* @__PURE__ */ v("p", {
		className: M.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: M.author,
				children: I(e)
			}),
			/* @__PURE__ */ _("time", {
				className: M.when,
				children: mn(e.props.at)
			}),
			t && /* @__PURE__ */ _("span", {
				className: M.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function en({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ _(N, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Yt)
	}) : /* @__PURE__ */ _(on, {
		block: e,
		editor: t
	});
}
function tn({ block: e, editor: t }) {
	let [n, r] = d(!1), i = an(e);
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(N, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ _(nn, {
		question: rn(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function nn({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ v("div", {
		className: M.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("p", {
				className: M.question,
				children: e
			}),
			/* @__PURE__ */ _(N, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ _(N, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function rn(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function an(e) {
	let t = b();
	if (!P(e)) return [e];
	let n = F(e);
	return t.document.filter((e) => e.type === "comment" && F(e) === n);
}
function on({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ v(g, { children: [n ? /* @__PURE__ */ _(sn, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ _(N, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ _(N, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Jt)
	})] });
}
function N({ label: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function sn({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = ln({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ _("form", {
		className: M.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ _(cn, {
			to: I(e),
			draft: r,
			onDraft: i
		})
	});
}
function cn({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ _("input", {
		className: M.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function ln({ editor: e, block: t }) {
	let { user: n } = E(), r = b();
	return (i) => {
		if (!i) return;
		let a = F(t), o = r.document, s = fn(o, a) ?? t;
		e.insertBlocks([pn(a, i, n.name)], s, "after");
	};
}
function un(e) {
	let t = b(), n = () => dn(t.document, e), [r, i] = d(n);
	return Ne(() => i(n())), r;
}
function dn(e, t) {
	return e.some((e) => P(e) && F(e) === t && e.props.resolved === !0);
}
function fn(e, t) {
	return e.filter((e) => e.type === "comment" && F(e) === t).at(-1);
}
function P(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function F(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function I(e) {
	return String(e.props.author || "Someone");
}
function pn(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: h("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function mn(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var L = {
	finding: "_finding_gtne7_1",
	who: "_who_gtne7_24",
	label: "_label_gtne7_37",
	why: "_why_gtne7_41",
	text: "_text_gtne7_45",
	actions: "_actions_gtne7_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function hn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ v("aside", {
		className: L.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": vn(r),
		children: [
			/* @__PURE__ */ _(gn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ _("div", {
				className: L.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ _(_n, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function gn({ severity: e, why: t }) {
	return /* @__PURE__ */ v("p", {
		className: L.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("span", {
			className: L.label,
			children: vn(e)
		}), t && /* @__PURE__ */ _("span", {
			className: L.why,
			children: t
		})]
	});
}
function _n({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: L.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ _("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function vn(e) {
	return `Finding · ${e}`;
}
var R = {
	block: "_block_r7uop_1",
	meta: "_meta_r7uop_7",
	head: "_head_r7uop_15",
	label: "_label_r7uop_23",
	kind: "_kind_r7uop_28",
	link: "_link_r7uop_34",
	content: "_content_r7uop_45"
};
//#endregion
//#region src/blocks/MockupView.tsx
function yn({ block: e }) {
	let { renderMockup: t } = o(dt);
	return /* @__PURE__ */ v("figure", {
		className: R.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ _(bn, { mockup: e.props }), t ? t(e.props) : /* @__PURE__ */ _("p", { children: "The host renders mockups; none is configured." })]
	});
}
function bn({ mockup: e }) {
	return /* @__PURE__ */ v("figcaption", {
		className: R.label,
		children: [e.caption || "Sketch", e.kind && /* @__PURE__ */ _("span", {
			className: R.kind,
			children: e.kind
		})]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var xn = {
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
}, z = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, Sn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function Cn({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: z.steps,
		disabled: r
	};
	return /* @__PURE__ */ v("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ _("legend", {
			className: z.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ _(wn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function wn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ v("label", {
		className: z.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ _("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), Sn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var Tn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function En(e, t) {
	return e[String(t)] ?? String(t);
}
var B = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function Dn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ v("span", {
		className: B.field,
		"data-field": e,
		children: [/* @__PURE__ */ _("label", {
			className: B.label,
			htmlFor: n,
			children: En(Tn, e)
		}), /* @__PURE__ */ _(On, {
			...t,
			id: n
		})]
	});
}
function On(e) {
	return e.spec.values ? /* @__PURE__ */ _(kn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ _(An, { ...e });
}
function kn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ _("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ _("option", { children: e }, e))
	});
}
function An({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ _("input", {
		id: e,
		className: B.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var jn = { maturity: Cn };
function Mn({ block: e, editor: t, contentRef: n }) {
	let r = xn[e.type];
	return /* @__PURE__ */ v("div", {
		className: R.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ _(Nn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ _("div", {
			className: R.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function Nn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ v("div", {
		className: R.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("p", {
			className: R.head,
			children: [/* @__PURE__ */ _("span", {
				className: R.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ _(Pn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ _(Fn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Pn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ v("a", {
		className: R.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ _("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function Fn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = p[e.type], o = a;
	return r(jn[n] ?? Dn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var In = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Ln({ contentRef: e }) {
	return /* @__PURE__ */ _("h1", {
		className: In.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var V = {
	question: "_question_c5pm0_1",
	asked: "_asked_c5pm0_8",
	label: "_label_c5pm0_17",
	why: "_why_c5pm0_21",
	how: "_how_c5pm0_25",
	text: "_text_c5pm0_31",
	suggestions: "_suggestions_c5pm0_35",
	suggestion: "_suggestion_c5pm0_35",
	answerBox: "_answerBox_c5pm0_62",
	answerInput: "_answerInput_c5pm0_68",
	answerButton: "_answerButton_c5pm0_86"
};
//#endregion
//#region src/blocks/QuestionView.tsx
function Rn({ block: e, editor: t, contentRef: n }) {
	let r = fe(e.props.options);
	return /* @__PURE__ */ v("div", {
		className: V.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ _(zn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ _("div", {
				className: V.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ _(Bn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function zn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ _("p", {
		className: V.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ _("span", {
			className: V.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ v("p", {
		className: V.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: V.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ _("span", {
				className: V.why,
				children: e
			}),
			/* @__PURE__ */ _("span", {
				className: V.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Bn({ block: e, editor: t, options: n }) {
	return Kn(Jn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ _(Vn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ _(Un, {
		block: e,
		editor: t
	});
}
function Vn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ _("ul", {
		className: V.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Hn, {
			onPick: () => Gn(t, e, n),
			children: n
		}) }, n))
	});
}
function Hn({ onPick: e, children: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: V.suggestion,
		onClick: e,
		children: t
	});
}
function Un({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ v("form", {
		className: V.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Gn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ _(Wn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: V.answerButton,
			children: "Answer"
		})]
	});
}
function Wn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ _("input", {
		className: V.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Gn(e, t, n) {
	if (!n) return;
	let r = Jn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Kn(e) {
	let t = b(), [n, r] = d(() => qn(t.document, e));
	return Ne(() => r(qn(t.document, e))), n;
}
function qn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Jn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/session/remove-section.ts
function Yn(e, t) {
	Ke(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var H = n(null), Xn = n(/* @__PURE__ */ new Map());
function Zn(e) {
	let t = o(H), n = o(Xn).get(e);
	return t ? se(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var Qn = /* @__PURE__ */ new WeakMap();
function $n(e) {
	let t = Qn.get(e);
	if (t) return t;
	let n = et(e);
	return Qn.set(e, n), e.once("update", () => Qn.delete(e)), n;
}
//#endregion
//#region src/session/use-doc-version.ts
function er(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
var U = {
	generate: "_generate_en660_1",
	bar: "_bar_en660_8",
	note: "_note_en660_16",
	button: "_button_en660_21",
	failed: "_failed_en660_45"
}, tr = "prototype", nr = "The agent draws diagrams and screen sketches from this plan.";
function rr({ doc: e, slot: t }) {
	let { onGeneratePrototype: n } = E(), r = cr(e, t);
	return t !== tr || !n || r ? null : /* @__PURE__ */ _(ir, { generate: n });
}
function ir({ generate: e }) {
	let { asking: t, refusal: n, ask: r } = ar(e);
	return /* @__PURE__ */ v("div", {
		className: U.generate,
		children: [/* @__PURE__ */ v("p", {
			className: U.bar,
			children: [/* @__PURE__ */ _("button", {
				type: "button",
				className: U.button,
				disabled: t,
				onClick: r,
				children: t ? "Asking the agent…" : "Generate prototype"
			}), /* @__PURE__ */ _("span", {
				className: U.note,
				children: nr
			})]
		}), n && /* @__PURE__ */ _(or, { reason: n })]
	});
}
function ar(e) {
	let [t, n] = d(!1), [r, i] = d(null);
	return {
		asking: t,
		refusal: r,
		ask: () => {
			n(!0), i(null), e().catch((e) => i(sr(e))).finally(() => n(!1));
		}
	};
}
function or({ reason: e }) {
	return /* @__PURE__ */ v("p", {
		className: U.failed,
		role: "alert",
		children: ["The agent cannot draw the prototype now: ", e]
	});
}
function sr(e) {
	return e instanceof Error ? e.message : String(e);
}
function cr(e, t) {
	let n = er(e);
	return l(() => me($n(e)).find((e) => e.slot === t)?.blocks.some(ce) ?? !1, [
		e,
		t,
		n
	]);
}
//#endregion
//#region src/session/use-section-refine.ts
function lr(e, t) {
	let n = er(e);
	return l(() => {
		let n = $n(e), r = _e(n, t), i = $e(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ye(r),
			proposal: a,
			busyFor: ur(i, t),
			preview: a?.status === "proposed" ? ge(n, a) : void 0,
			...dr(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function ur(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function dr(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: we(n),
			baseHash: Je(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void We(e, t),
		applyAnyway: () => void qe(e, t),
		discard: () => Ze(e, t)
	};
}
//#endregion
//#region src/blocks/RefineControls.tsx
function fr(e) {
	let t = lr(e.doc, e.slot), [n, r] = d(null), i = mr(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ _(pr, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ _(gr, { ...a });
}
function pr({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ _(xr, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ _(Sr, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ _(Cr, {
			...t,
			proposal: e
		});
	}
}
function mr({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = E();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(hr(e));
		});
	};
}
function hr(e) {
	return e instanceof Error ? e.message : String(e);
}
function gr({ refine: e, ask: t, refusal: n }) {
	let r = e.settled === 0 && e.busyFor === void 0;
	return /* @__PURE__ */ v(g, { children: [n && /* @__PURE__ */ _(yr, { reason: n }), r ? /* @__PURE__ */ _(_r, {}) : /* @__PURE__ */ _(vr, {
		refine: e,
		ask: t
	})] });
}
function _r() {
	return /* @__PURE__ */ _("p", {
		className: O.hint,
		children: "Nothing for the agent to refine yet. Answer a question in this section or resolve a comment, and Refine appears here."
	});
}
function vr({ refine: e, ask: t }) {
	let n = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		children: [/* @__PURE__ */ _(Er, {
			label: "Refine this section",
			run: t,
			disabled: !n
		}), /* @__PURE__ */ _("span", {
			className: O.note,
			children: br(e)
		})]
	});
}
function yr({ reason: e }) {
	return /* @__PURE__ */ v("p", {
		className: O.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function br(e) {
	return e.busyFor === void 0 ? `uses ${Ar(e)}` : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function xr({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		role: "status",
		children: [/* @__PURE__ */ v("span", {
			className: O.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: O.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Sr({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ v("section", {
		className: O.proposal,
		children: [/* @__PURE__ */ v("p", {
			className: O.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ v("p", {
			className: O.bar,
			children: [
				/* @__PURE__ */ _(Er, {
					label: "Ask again",
					run: t,
					disabled: e.busyFor !== void 0
				}),
				/* @__PURE__ */ _(Dr, {
					label: "Dismiss",
					run: e.discard
				}),
				/* @__PURE__ */ _(Tr, { refine: e })
			]
		})]
	});
}
function Cr({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ v("section", {
		className: O.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ v("p", {
				className: O.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					jr(r)
				]
			}),
			/* @__PURE__ */ _(Or, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ v("p", {
				className: O.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ _(wr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function wr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		children: [
			/* @__PURE__ */ _(Er, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ _(Dr, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ _(Dr, {
				label: "Discard",
				run: e.discard
			}),
			n && /* @__PURE__ */ _(Tr, { refine: e })
		]
	});
}
function Tr({ refine: e }) {
	return e.busyFor !== void 0 && /* @__PURE__ */ v("span", {
		className: O.note,
		children: [
			"The agent is refining another section for ",
			e.busyFor,
			"; ask again when it finishes"
		]
	});
}
function Er({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: O.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function Dr({ label: e, run: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: O.quiet,
		onClick: t,
		children: e
	});
}
function Or({ lines: e }) {
	return /* @__PURE__ */ _("ul", {
		className: O.lines,
		children: e.map((e, t) => /* @__PURE__ */ _("li", {
			className: O[e.kind],
			children: /* @__PURE__ */ _(kr, { line: e })
		}, `${t}-${e.text}`))
	});
}
function kr({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ _("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ _("del", { children: e.text }) : e.text;
}
function Ar({ inputs: e }) {
	return Mr(e.answered.length, e.resolved.length);
}
function jr({ uses: e }) {
	let t = Mr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Mr(e, t) {
	return [Nr(e, "answer"), Nr(t, "resolved thread")].filter(Boolean).join(", ");
}
function Nr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var W = {
	actions: "_actions_sq3sl_1",
	remove: "_remove_sq3sl_10",
	confirm: "_confirm_sq3sl_28",
	question: "_question_sq3sl_42",
	explanation: "_explanation_sq3sl_49",
	choices: "_choices_sq3sl_55",
	cancel: "_cancel_sq3sl_61",
	danger: "_danger_sq3sl_62"
};
//#endregion
//#region src/blocks/SectionActions.tsx
function Pr({ block: e, editor: t }) {
	let { slot: n, title: r } = Vr(e), { onRefine: i, doc: a } = E();
	return !a || !t.isEditable ? null : /* @__PURE__ */ v("div", {
		role: "group",
		className: W.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(rr, {
				doc: a,
				slot: n
			}),
			i && /* @__PURE__ */ _(fr, {
				doc: a,
				slot: n,
				title: r
			}),
			/* @__PURE__ */ _(Fr, {
				doc: a,
				slot: n,
				title: r
			})
		]
	});
}
function Fr({ doc: e, slot: t, title: n }) {
	let r = o(H), [i, a] = d(!1);
	return !r || !ue(r, t) ? null : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(Ir, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ _(Lr, {
		title: n,
		onConfirm: () => Yn(e, t),
		onCancel: () => a(!1)
	})] });
}
function Ir({ title: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: W.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ _(Br, {})
	});
}
function Lr({ title: e, onConfirm: t, onCancel: n }) {
	let r = Rr(), i = c();
	return /* @__PURE__ */ v("dialog", {
		ref: r,
		className: W.confirm,
		"aria-labelledby": i,
		onClose: n,
		children: [
			/* @__PURE__ */ v("h3", {
				id: i,
				className: W.question,
				children: [
					"Remove ",
					e,
					"?"
				]
			}),
			/* @__PURE__ */ _("p", {
				className: W.explanation,
				children: "Its content, comments and questions are deleted."
			}),
			/* @__PURE__ */ _(zr, {
				onConfirm: t,
				onCancel: n
			})
		]
	});
}
function Rr() {
	let e = u(null);
	return s(() => e.current?.showModal(), []), e;
}
function zr({ onConfirm: e, onCancel: t }) {
	return /* @__PURE__ */ v("div", {
		className: W.choices,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: W.cancel,
			autoFocus: !0,
			onClick: t,
			children: "Cancel"
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: W.danger,
			onClick: e,
			children: "Remove"
		})]
	});
}
function Br() {
	return /* @__PURE__ */ _("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ _("path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" })
	});
}
function Vr(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: Zn(t)?.title ?? t
	};
}
var Hr = {
	composer: "_composer_in3m5_1",
	input: "_input_in3m5_8",
	send: "_send_in3m5_25"
};
//#endregion
//#region src/blocks/CommentComposer.tsx
function Ur(e) {
	let { draft: t, setDraft: n, say: r } = Wr(e), { title: i } = e.block.props;
	return /* @__PURE__ */ v("form", {
		className: Hr.composer,
		onSubmit: r,
		children: [/* @__PURE__ */ _(Gr, {
			title: i,
			draft: t,
			onDraft: n,
			onLeave: e.onDone
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: Hr.send,
			children: "Comment"
		})]
	});
}
function Wr({ block: e, editor: t, onDone: n }) {
	let { user: r } = E(), [i, a] = d("");
	return {
		draft: i,
		setDraft: a,
		say: (a) => {
			let o = i.trim();
			a.preventDefault(), o && (t.insertBlocks([Kr(o, r.name)], e, "after"), n());
		}
	};
}
function Gr({ title: e, draft: t, onDraft: n, onLeave: r }) {
	return /* @__PURE__ */ _("input", {
		className: Hr.input,
		value: t,
		"aria-label": `Comment on ${e}`,
		placeholder: "Add a comment",
		autoFocus: !0,
		onChange: (e) => n(e.target.value),
		onKeyDown: (e) => {
			e.key === "Escape" && r();
		}
	});
}
function Kr(e, t) {
	return {
		type: "comment",
		props: {
			commentId: h("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
var G = {
	heading: "_heading_80g3h_1",
	row: "_row_80g3h_10",
	comment: "_comment_80g3h_17",
	title: "_title_80g3h_44",
	hint: "_hint_80g3h_52"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function qr({ block: e, editor: t }) {
	let [n, r] = d(!1), { slot: i, title: a } = e.props;
	return /* @__PURE__ */ v("header", {
		className: G.heading,
		"data-slot": i,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(Yr, {
				title: a,
				commentable: t.isEditable,
				open: n,
				onToggle: () => r(!n)
			}),
			/* @__PURE__ */ _(Jr, { slot: i }),
			n && /* @__PURE__ */ _(Ur, {
				block: e,
				editor: t,
				onDone: () => r(!1)
			})
		]
	});
}
function Jr({ slot: e }) {
	let t = Zn(e)?.hint;
	return t && /* @__PURE__ */ _("p", {
		className: G.hint,
		children: t
	});
}
function Yr({ title: e, commentable: t, open: n, onToggle: r }) {
	return /* @__PURE__ */ v("div", {
		className: G.row,
		children: [/* @__PURE__ */ _("h2", {
			className: G.title,
			children: e
		}), t && /* @__PURE__ */ _(Xr, {
			title: e,
			open: n,
			onToggle: r
		})]
	});
}
function Xr({ title: e, open: t, onToggle: n }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: G.comment,
		"aria-expanded": t,
		"aria-label": `${t ? "Close comment" : "Comment"} on ${e}`,
		onMouseDown: (e) => e.preventDefault(),
		onClick: n,
		children: [/* @__PURE__ */ _(Zr, {}), "Comment"]
	});
}
function Zr() {
	return /* @__PURE__ */ _("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ _("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
	});
}
//#endregion
//#region src/blocks/SectionPanel.tsx
function Qr() {
	return null;
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var $r = { render: Mn }, ei = {
	"plan-title": y(p["plan-title"], { render: Ln })(),
	"section-heading": y(p["section-heading"], { render: qr })(),
	"section-panel": y(p["section-panel"], { render: Qr })(),
	"section-actions": y(p["section-actions"], { render: Pr })(),
	comment: y(p.comment, { render: Xt })(),
	finding: y(p.finding, { render: hn })(),
	kpi: y(p.kpi, $r)(),
	prototype: y(p.prototype, $r)(),
	mockup: y(p.mockup, { render: yn })(),
	question: y(p.question, { render: Rn })(),
	answer: y(p.answer, $r)()
}, ti = Fe.create({ blockSpecs: {
	...He,
	...ei
} });
//#endregion
//#region src/menu/section-context.ts
function ni(e, t) {
	let [n] = ii(e, t);
	return n ? String(n.props.slot) : null;
}
function ri(e, t) {
	let n = ii(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function ii(e, t) {
	let n = e.slice(0, ai(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function ai(e, t) {
	return e.findIndex((e) => oi(e, t));
}
function oi(e, t) {
	return e.id === t || e.children.some((e) => oi(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", si = { cells: [
	"",
	"",
	""
] }, ci = [
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
			rows: [si, si]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: q,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: h("kpi") })
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
		props: () => ({ questionId: h("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: q,
		props: (e) => {
			let t = ri(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function li(e, t) {
	return ci.filter((t) => e.allows.includes(t.kind)).flatMap((e) => ui(e, t));
}
function ui(e, t) {
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
function di() {
	let e = b(ti), t = o(H);
	return /* @__PURE__ */ _(je, {
		triggerCharacter: "/",
		getItems: async (n) => Ie(fi(e, t), n)
	});
}
function fi(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && pi(t, i);
	return a ? li(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Le(e, Kt(t))
	})) : [];
}
function pi(e, { blocks: t, cursorId: n }) {
	let r = ni(t, n);
	return r === null ? void 0 : se(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function mi(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		...hi(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function hi(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && de(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function gi(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
//#endregion
//#region src/outline/section-state.ts
function _i(e, t) {
	return t.length > 0 ? "problem" : e.inPlan ? "ready" : "missing";
}
function vi(e) {
	let t = e.filter(({ section: e }) => e.required);
	return {
		ready: t.filter(({ section: e, problems: t }) => _i(e, t) === "ready").length,
		total: t.length
	};
}
var J = {
	outline: "_outline_10xao_1",
	phase: "_phase_10xao_6",
	progress: "_progress_10xao_13",
	bar: "_bar_10xao_18",
	slots: "_slots_10xao_40",
	slot: "_slot_10xao_40",
	mark: "_mark_10xao_56",
	title: "_title_10xao_80",
	locate: "_locate_10xao_81",
	required: "_required_10xao_112",
	settled: "_settled_10xao_118",
	problems: "_problems_10xao_123",
	footer: "_footer_10xao_131"
}, yi = [], bi = /* @__PURE__ */ new Map(), xi = /* @__PURE__ */ new Map();
function Si({ approval: e = null, children: t, ...n }) {
	let r = Oi(n);
	return /* @__PURE__ */ v("nav", {
		className: J.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ _("p", {
				className: J.phase,
				children: wi(e, n.report)
			}),
			!e && /* @__PURE__ */ _(Ci, { ...vi(r) }),
			/* @__PURE__ */ _("ol", {
				className: J.slots,
				children: r.map((e) => /* @__PURE__ */ _(ji, { ...e }, e.section.slot))
			}),
			t && /* @__PURE__ */ _("div", {
				className: J.footer,
				children: t
			})
		]
	});
}
function Ci({ ready: e, total: t }) {
	return t === 0 ? null : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ v("p", {
		className: J.progress,
		children: [
			e,
			" of ",
			t,
			" required sections ready"
		]
	}), /* @__PURE__ */ _("progress", {
		className: J.bar,
		"aria-label": "Required sections ready",
		value: e,
		max: t
	})] });
}
function wi(e, t) {
	return e ? Ei(e) : Ti(t);
}
function Ti(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function Ei({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Di(t)}`;
}
function Di(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Oi({ template: e, report: t, sections: n = yi, droppedSlots: r, settled: i = bi, failed: a = xi, onLocate: o }) {
	let s = gi(t.problems);
	return mi(e, {
		sections: n,
		droppedSlots: r
	}, t.phase).map((e) => ({
		section: e,
		problems: s.get(e.slot) ?? [],
		settled: i.get(e.slot) ?? 0,
		failure: a.get(e.slot),
		onLocate: o
	}));
}
var ki = {
	ready: "ready",
	problem: "needs work",
	missing: "not in the plan"
}, Ai = {
	ready: "✓",
	problem: "!",
	missing: ""
};
function ji({ problems: e, settled: t, failure: n, ...r }) {
	let { section: i } = r, a = _i(i, e);
	return /* @__PURE__ */ v("li", {
		className: J.slot,
		"aria-label": `${i.title}, ${ki[a]}`,
		children: [
			/* @__PURE__ */ _(Mi, { state: a }),
			/* @__PURE__ */ _(Fi, { ...r }),
			i.required && /* @__PURE__ */ _("span", {
				className: J.required,
				children: "required"
			}),
			/* @__PURE__ */ _(Ni, {
				problems: e,
				settled: t,
				failure: n
			})
		]
	});
}
function Mi({ state: e }) {
	return /* @__PURE__ */ _("span", {
		className: J.mark,
		"aria-hidden": "true",
		"data-state": e,
		children: Ai[e]
	});
}
function Ni({ problems: e, settled: t, failure: n }) {
	return /* @__PURE__ */ v(g, { children: [
		/* @__PURE__ */ _(Pi, { text: t > 0 && Ii(t) }),
		/* @__PURE__ */ _(Pi, { text: n && `Refine failed: ${n}` }),
		/* @__PURE__ */ _("ul", {
			className: J.problems,
			children: e.map((e) => /* @__PURE__ */ _("li", { children: e.message }, `${e.code}-${e.message}`))
		})
	] });
}
function Pi({ text: e }) {
	return e && /* @__PURE__ */ _("span", {
		className: J.settled,
		children: e
	});
}
function Fi({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ _("span", {
		className: J.title,
		children: e.title
	}) : /* @__PURE__ */ _("button", {
		type: "button",
		className: J.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function Ii(e) {
	return `${e} ${e === 1 ? "settled input" : "settled inputs"} waiting for a refine`;
}
var Y = {
	editor: "_editor_1ajpy_1",
	withSidebar: "_withSidebar_1ajpy_9",
	single: "_single_1ajpy_13",
	sidebar: "_sidebar_1ajpy_22"
}, X = {
	participants: "_participants_ogqfd_1",
	locate: "_locate_ogqfd_16",
	away: "_away_ogqfd_17",
	dot: "_dot_ogqfd_42"
}, Z = /* @__PURE__ */ "#c32222.#278643.#9213ec.#827517.#287a8a.#e21283.#338618.#2c288a.#cb4f10.#18865d.#82288a.#677f0a.#2272c3.#8a283c.#0b8916.#5f22c3.#8a6a28.#0b847f.#c3229b.#508226.#1337ec.#c33722.#27864f.#ad13ec.#797915.#286d8a.#e21268.#258618.#39288a.#b85d0f.#18866b.#8a2886.#587f0a.#225ec3.#8a2830.#0b8926.#7422c3.#867327.#0b828e.#c32286.#448226.#131bec.#c34b22.#27865b.#c513e7.#6c7915.#28618a.#e7134f.#188618.#45288a".split(".");
function Li(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(Ri)) t.has(n.userId) || t.set(n.userId, Bi(n.color, [...t.values()]));
	return t;
}
function Ri(e, t) {
	return Number(zi(t)) - Number(zi(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function zi({ color: e }) {
	return e !== void 0 && Z.includes(e);
}
function Bi(e, t) {
	let n = Z.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? Z[t.length % Z.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Vi(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Hi(e, n)]);
}
function Hi(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Ki(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? Z[0]),
		slot: qi(n),
		hasCursor: r != null
	};
}
function Ui(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Wi(e, t)] : []);
}
function Wi(e, t) {
	return {
		clientId: e,
		userId: Ki(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Gi(e, t) {
	let n = e.get(t)?.user, r = n && Li(Ui(e)).get(Ki(t, n));
	return r === n?.color ? void 0 : r;
}
function Ki(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function qi(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Ji(e, t, n) {
	let r = e.slot && se(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Yi = "⁠";
function Xi(e) {
	let t = `background-color: var(${Qi(e.id ?? "")}, ${e.color}); color: white`, n = ea("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = ea("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = ea("bn-collaboration-cursor__base");
	return i.append(Yi, r, Yi), i;
}
function Zi(e, t) {
	t.forEach((t) => e.style.setProperty(Qi(t.id), t.color));
}
function Qi(e) {
	return `--ps-peer-${[...e].map($i).join("")}`;
}
function $i(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function ea(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function ta(e) {
	let [t, n] = d(() => sa(e));
	return aa(e, () => n(sa(e))), t;
}
function na(e, t) {
	oa(e, t), ra(t), ia(e, t);
}
function ra(e) {
	aa(e, () => {
		let t = Gi(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function ia(e, t) {
	aa(t, () => {
		let n = e.domElement;
		n && Zi(n, sa(t));
	});
}
function aa(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function oa(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: ni(r, n.id) });
	}), [e, t]);
}
function sa(e) {
	return Vi(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function ca({ awareness: e, ...t }) {
	let n = ta(e);
	return n.length === 0 ? null : /* @__PURE__ */ _("ul", {
		className: X.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(la, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function la({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Ji(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ _("button", {
		type: "button",
		className: X.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: ua,
		onClick: () => r(e),
		children: /* @__PURE__ */ _(da, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ _("span", {
		className: X.away,
		children: /* @__PURE__ */ _(da, {
			color: e.color,
			label: i
		})
	});
}
function ua(e) {
	e.preventDefault();
}
function da({ color: e, label: t }) {
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _("svg", {
		className: X.dot,
		viewBox: "0 0 2 2",
		"aria-hidden": "true",
		children: /* @__PURE__ */ _("circle", {
			cx: "1",
			cy: "1",
			r: "1",
			fill: e
		})
	}), t] });
}
//#endregion
//#region src/presence/scroll-to-cursor.ts
function fa(e, t) {
	let n = e.prosemirrorView, r = pa(n, t);
	r !== null && ma(n, r)?.scrollIntoView({ block: "center" });
}
function pa(e, t) {
	let [n] = Be.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function ma(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
//#endregion
//#region src/session/refine-failures.ts
function ha(e, t) {
	return e.flatMap((e) => e.status === "failed" ? [{
		slot: e.slot,
		title: t.get(e.slot) ?? e.slot,
		reason: e.reason
	}] : []);
}
function ga(e, t, n) {
	let r = er(e), i = l(() => ha($e(e), t), [
		e,
		t,
		r
	]);
	return _a(i, n), l(() => new Map(i.map(({ slot: e, reason: t }) => [e, t])), [i]);
}
function _a(e, t) {
	let n = u(void 0), r = JSON.stringify(e);
	s(() => {
		n.current !== r && (n.current = r, t?.(e));
	});
}
var va = { notice: "_notice_1xdcv_1" }, ya = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function ba({ status: e, reason: t }) {
	return /* @__PURE__ */ v("p", {
		className: va.notice,
		role: "status",
		"data-status": e,
		children: [ya[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function xa(e, t) {
	let n = Ma(e, t);
	return l(() => Sa(e), [e, n]);
}
function Sa(e) {
	let t = new Set(tt(e).map((e) => e.changeId)), n = $n(e);
	return Ye(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: wa(n, r),
		write: () => t.has(r.changeId) ? Ge(e, r.changeId) : Ue(e, r.changeId),
		discard: () => Xe(e, r.changeId)
	}));
}
var Ca = {
	"remove-block": Ta,
	"set-section-text": Ea,
	"set-section-prose": Ea
};
function wa(e, t) {
	let n = Ca[t.op.op];
	return n && ae(t).length === 0 ? n(e, t) : void 0;
}
function Ta(e, t) {
	let n = e.flatMap(Oa).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: Aa(n)
	};
}
function Ea(e, { op: t, slot: n }) {
	let r = new Set(Da(ie(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Da(e, n).filter((e) => !r.has(e.id)).flatMap(Aa)
	};
}
function Da(e, t) {
	return me(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Oa(e) {
	return [e, ...ka(e).flatMap(Oa)];
}
function ka(e) {
	return le(e) ? [] : e.children;
}
function Aa(e) {
	return [ja(e.content), ...ka(e).flatMap(Aa)].filter(Boolean);
}
function ja(e) {
	return Array.isArray(e) ? he(e) : be(e).flat().map(he).join(" · ");
}
function Ma(e, t) {
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
var Na = "plan-transport", Pa = class extends nt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Fa(e) {
	let t = new at(), n = {
		doc: t,
		awareness: new Pa(t)
	}, r = La({
		status: "connecting",
		meta: null
	});
	Ba(n, e);
	let i = e.subscribe((e) => za({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Ia(n, i)
	};
}
function Ia({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function La(e) {
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
var Ra = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		ot(e, w(n), Na), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => ot(e, w(t), Na),
	awareness: ({ awareness: e }, { update: t }) => rt(e, w(t), Na),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function za(e, t) {
	Ra[t.type](e, t);
}
function Ba({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: T(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = it(n, e(t));
		r.send({
			type: "awareness",
			update: T(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function Va(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = Fa(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Ha(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Ua = new Re("planChangeWidgets");
function Wa(e, t) {
	return x({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new C({
			key: Ua,
			props: { decorations: (n) => ut.create(n.doc, Ga(n, e, t)) }
		})]
	});
}
function Ga(e, t, n) {
	let r = Ya(e);
	return Ye(t).flatMap((e) => {
		let t = Ka(r, e);
		return t === void 0 ? [] : [qa(t, e, n)];
	});
}
function Ka(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function qa(e, t, n) {
	return lt.widget(e, () => Ja(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Ja(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Ya(e) {
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
//#region src/template/focus-release.ts
var Xa = [
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"CapsLock"
];
function Za(e) {
	let { dom: t } = e;
	t instanceof HTMLElement && t.blur();
}
function Qa(e) {
	let { dom: t } = e, n = new AbortController(), { signal: r } = n, i = {
		capture: !0,
		signal: r
	}, { ownerDocument: a } = t;
	a.addEventListener("paste", $a(t), i), a.addEventListener("pointerup", () => {
		setTimeout(() => n.abort());
	}, i), a.addEventListener("keydown", eo(n), i), a.defaultView?.addEventListener("blur", () => n.abort(), { signal: r });
}
function $a(e) {
	return (t) => {
		t.target instanceof Node && e.contains(t.target) && (t.preventDefault(), t.stopPropagation());
	};
}
function eo(e) {
	return ({ key: t }) => {
		Xa.includes(t) || e.abort();
	};
}
function to(e) {
	let t = [];
	return e.firstChild?.forEach((e, n) => {
		let r = e.firstChild;
		t.push({
			pos: n + 1,
			node: e,
			content: r,
			type: r?.type.name ?? ""
		});
	}), t;
}
//#endregion
//#region src/template/placeholders.ts
var no = "Write here…", ro = "paragraph", io = "ps-empty-section", ao = [
	...ne,
	"question",
	"answer"
], oo = 0;
function so(e, t) {
	return co(to(e)).flatMap((e) => uo(e, t));
}
function co(e) {
	return e.reduce((e, t) => {
		if (t.type === "section-heading") return e.push({
			title: lo(t),
			blocks: [],
			closed: !1
		}), e;
		let n = e.at(-1);
		return n && !n.closed && (n.blocks.push(t), n.closed = t.type === m), e;
	}, []);
}
function lo({ content: e }) {
	return String(e?.attrs.title ?? "");
}
function uo(e, t) {
	if (e.blocks.some(fo)) return [];
	let n = e.blocks.find(po);
	if (n) return [mo(n)];
	let r = e.blocks.find((e) => !f.includes(e.type));
	return r ? [ho(r, e.title, t)] : [];
}
function fo(e) {
	return !ao.includes(e.type) && !po(e);
}
function po({ node: e, content: t, type: n }) {
	return n === ro && e.childCount === 1 && t?.content.size === 0;
}
function mo({ pos: e, content: t }) {
	let n = e + 1;
	return lt.node(n, n + (t?.nodeSize ?? 0), { "data-plan-placeholder": no });
}
function ho({ pos: e, node: t }, n, r) {
	let i = String(t.attrs.id ?? "");
	return lt.widget(e, () => go(n, () => r(i)), {
		side: -1,
		key: `empty-${i}-${n}`,
		stopEvent: () => !0
	});
}
function go(e, t) {
	let n = document.createElement("div");
	return n.className = io, n.contentEditable = "false", n.role = "button", n.tabIndex = 0, n.ariaLabel = `${no} in ${e}`, n.textContent = no, n.addEventListener("mousedown", (e) => {
		_o(e, t);
	}), n.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
	}), n;
}
function _o(e, t) {
	e.preventDefault(), e.button === oo && t();
}
function vo(e, t) {
	e.transact(() => {
		let [n] = e.insertBlocks([{ type: ro }], t, "before");
		n && e.setTextCursorPosition(n, "start");
	}), e.focus();
}
//#endregion
//#region src/template/platform.ts
var yo = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), bo = [
	"Enter",
	"Backspace",
	"Delete"
], xo = [
	"d",
	"h",
	"k",
	"o",
	"t"
];
function So(e) {
	let { key: t, metaKey: n } = e;
	return (bo.includes(t) || [...t].length === 1) && !n && !Co(e);
}
function Co(e) {
	let t = yo && xo.includes(e.key);
	return e.ctrlKey && !t && !e.getModifierState("AltGraph");
}
//#endregion
//#region src/template/empty-section.ts
var wo = new Re("planEmptySection"), Q = A.filter((e) => e !== "plan-title"), To = ".bn-block-group, .bn-block-outer, .bn-block", Eo = "button, input, textarea, select, a, [role='button']", Do = ":disabled, [aria-disabled='true']", Oo = ["section-panel", "section-actions"], ko = 1, Ao = x(({ editor: e }) => ({
	key: "planEmptySection",
	prosemirrorPlugins: [new C({
		key: wo,
		props: jo(e)
	})]
}))();
function jo(e) {
	let t = (t) => vo(e, t);
	return {
		decorations: (n) => e.isEditable ? ut.create(n.doc, so(n.doc, t)) : ut.empty,
		handleDOMEvents: { mousedown: Mo },
		handleClickOn: Zo,
		handleKeyDown: Io,
		handlePaste: Fo
	};
}
function Mo(e, t) {
	let n = e.editable && Po(e, t);
	return n && Za(e), (n || Go(e, t.target)) && No(e, t) && Qa(e), n;
}
function No(e, t) {
	return e.editable && t.button === ko;
}
function Po(e, t) {
	return Ho(e, t) || Uo(e, t);
}
function Fo(e, t) {
	return e.editable && !Bo(t.target) && Lo(e);
}
function Io(e, t) {
	return So(t) && !Bo(t.target) && Lo(e);
}
function Lo(e) {
	return Vo(e.state.selection) || Ro(e);
}
function Ro(e) {
	let t = zo(e), n = t instanceof Element ? t : t?.parentElement;
	return n && e.dom.contains(n) ? Q.includes(qo(n)) : !1;
}
function zo({ root: e, dom: t }) {
	return (e.getSelection?.() ?? t.ownerDocument.getSelection())?.anchorNode;
}
function Bo(e) {
	let t = e instanceof Element ? e.closest(Eo) : null;
	return t !== null && !t.matches(Do);
}
function Vo(e) {
	if (!(e instanceof S)) return !1;
	let { type: t } = e.node;
	return Q.includes(t.name);
}
function Ho(e, t) {
	return !Jo(e, t.target) || !Yo(e, t) ? !1 : (t.preventDefault(), !0);
}
function Uo(e, t) {
	return Wo(e, t.target) ? (t.preventDefault(), !0) : !1;
}
function Wo(e, t) {
	if (!(t instanceof Element) || !e.dom.contains(t)) return !1;
	let n = qo(t);
	return Q.includes(n) && !Bo(t) && !(Oo.includes(n) && Ko(t));
}
function Go(e, t) {
	return t instanceof Element && e.dom.contains(t) && Q.includes(qo(t));
}
function Ko(e) {
	return [...e.childNodes].some((e) => e instanceof Text && e.data.trim() !== "");
}
function qo(e) {
	return e.closest(".bn-block-content")?.getAttribute("data-content-type") ?? "";
}
function Jo(e, t) {
	return t instanceof Element && (t === e.dom || t.matches(To));
}
function Yo(e, t) {
	let n = to(e.state.doc).filter((n) => Xo(e, n, t.clientY));
	return n.length > 0 && n.every((e) => Q.includes(e.type));
}
function Xo(e, { pos: t }, n) {
	let r = e.nodeDOM(t);
	if (!(r instanceof Element)) return !1;
	let { top: i, bottom: a } = r.getBoundingClientRect();
	return i <= n && n <= a;
}
function Zo(...[e, , t]) {
	return e.editable && Q.includes(t.type.name);
}
//#endregion
//#region src/template/section-moves.ts
var Qo = {
	ArrowUp: "up",
	ArrowDown: "down"
}, $o = 3, es = 2, ts = x({
	key: "planSectionMoves",
	prosemirrorPlugins: [new C({ props: { handleKeyDown: ns } })]
});
function ns(e, t) {
	let n = rs(t);
	if (!n) return !1;
	let r = to(e.state.doc), i = as(e.state, r), a = i < 0 ? "one-step" : cs(n, r, i);
	return typeof a == "number" && e.dispatch(fs(e.state, r[i], a)), a !== "one-step";
}
function rs(e) {
	return is(e) && e.shiftKey && !e.altKey ? Qo[e.key] : void 0;
}
function is({ metaKey: e, ctrlKey: t }) {
	return yo ? e && !t : t && !e;
}
function as(e, t) {
	let { selection: n } = e;
	return os(n) ? t.findIndex(({ pos: e, node: t, type: r }) => e < n.from && n.to < e + t.nodeSize && !A.includes(r)) : -1;
}
function os(e) {
	let { $from: t, $to: n } = e, r = ss(e);
	return t.depth <= r && n.depth <= r;
}
function ss(e) {
	return e instanceof S ? es : e instanceof ze ? $o : -1;
}
function cs(e, t, n) {
	return e === "down" ? ls(t, n) : us(t, n);
}
function ls(e, t) {
	if (e[t + 1]?.type !== m) return "one-step";
	let n = e.findIndex((e, n) => n > t && e.type === "section-heading");
	return e.find((e, t) => n >= 0 && t > n && !f.includes(e.type))?.pos ?? "nowhere";
}
function us(e, t) {
	let n = e.slice(0, t).reverse(), r = n.find((e) => !f.includes(e.type));
	if (!r || r.type !== "section-heading") return "one-step";
	let i = n.find((e) => e.pos < r.pos && [m, "section-heading"].includes(e.type));
	return i?.type === m ? i.pos : ds(i, r);
}
function ds(e, t) {
	return e ? t.pos : "nowhere";
}
function fs(e, t, n) {
	let { tr: r, selection: i } = e;
	if (!t) return r;
	let { pos: a, node: o } = t;
	r.delete(a, a + o.nodeSize);
	let s = r.mapping.map(n);
	return r.insert(s, o), r.setSelection(ps(r.doc, i, s - a)).scrollIntoView();
}
function ps(e, t, n) {
	return t instanceof S ? S.create(e, t.from + n) : ze.create(e, t.anchor + n, t.head + n);
}
//#endregion
//#region src/use-plan-editor.ts
function ms({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = hs(e, n, i), s = _s(o, e, a((e) => r?.(j(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => j(s, t), [s, t]),
		hosts: i
	};
}
function hs(e, t, n) {
	let { doc: r } = e;
	return Me(ct({
		schema: ti,
		extensions: gs(r, n),
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Xi
		}
	}), [e]);
}
function gs(e, t) {
	return [
		wt,
		Ao,
		ts,
		Wa(e, t)
	];
}
function _s(e, t, n) {
	let [r, i] = d(() => et(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var vs = {};
function ys({ transport: e, adapters: t = vs, className: n, ...r }) {
	let i = Va(e), a = bs(r);
	return /* @__PURE__ */ _(dt, {
		value: t,
		children: /* @__PURE__ */ _("div", {
			className: xs({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ _(Ss, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ _(ba, { status: "connecting" })
		})
	});
}
function bs({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function xs({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? Y.withSidebar : Y.single;
	return [
		Y.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function Ss({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Ha(t.session);
	if (!r) return /* @__PURE__ */ _(ba, {
		status: n,
		reason: i
	});
	let a = e ?? xe(r.type);
	return /* @__PURE__ */ v(H, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ _(ba, {
			status: n,
			reason: i
		}), /* @__PURE__ */ _(Cs, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Cs({ validationPhase: e = "approval", onValidation: t, onRefine: n, onGeneratePrototype: r, ...i }) {
	let { session: a, user: o } = i, { editor: s, plan: c, hosts: l } = ms(i), u = ws(a, s, l), d = Ns(c, e, t);
	na(s, a.awareness);
	let ee = {
		user: o,
		onRefine: n,
		onGeneratePrototype: r,
		doc: a.doc
	};
	return /* @__PURE__ */ _(ft, {
		value: ee,
		children: /* @__PURE__ */ _(Ts, {
			...i,
			...u,
			...c,
			report: d
		})
	});
}
function ws(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Ts({ onRefineFailures: e, ...t }) {
	let n = Ds(t.sections), r = ga(t.doc, n, e);
	return /* @__PURE__ */ v(Xn, {
		value: n,
		children: [/* @__PURE__ */ _(Ms, { ...t }), /* @__PURE__ */ _(Es, {
			...t,
			titles: n,
			failed: r
		})]
	});
}
function Es({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ v("aside", {
		className: Y.sidebar,
		children: [e && /* @__PURE__ */ _(Os, { ...n }), t && /* @__PURE__ */ _(ks, { ...n })]
	});
}
function Ds(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function Os({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ _(ca, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => fa(e, t.clientId)
	});
}
function ks({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = js(r.sections);
	return /* @__PURE__ */ _(Si, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => As(e, t),
		children: n
	});
}
function As(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function js(e) {
	return l(() => ve(Se({ sections: e }), e.map((e) => e.slot)), [e]);
}
function Ms({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = xa(n, () => Ps(e));
	return /* @__PURE__ */ v(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ _(di, {}),
			/* @__PURE__ */ _(zt, {}),
			/* @__PURE__ */ _(pt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Ns(e, t, n) {
	let r = l(() => Te(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Ps(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function Fs(e) {
	let t = Qe(e.blocks), n = new nt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Ls(r), {
		doc: t,
		connect: () => zs(r)
	};
}
function Is(e) {
	return Fs(e).connect();
}
function Ls(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Rs(t, n, {
		type: "update",
		update: T(e)
	})), r.on("update", (n, i) => {
		let a = it(r, e(n));
		Rs(t, i, {
			type: "awareness",
			update: T(a)
		});
	});
}
function Rs(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function zs(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Bs(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Vs(e, n), () => t.handlers.delete(n))
	};
}
function Bs(e, t, n) {
	if (n.type === "update") {
		ot(e.doc, w(n.update), t);
		return;
	}
	rt(e.awareness, w(n.update), t);
}
function Vs({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: T(st(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = it(t, i);
		r({
			type: "awareness",
			update: T(e)
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
}, Hs = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Us({ before: e, after: t, className: n }) {
	let r = oe(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ v("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ _("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ _(Ws, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ _(Gs, { section: e }, e.slot)),
			/* @__PURE__ */ _(Ks, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Ws({ changes: e }) {
	return /* @__PURE__ */ _("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ v("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function Gs({ section: e }) {
	return /* @__PURE__ */ v("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ _("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ _("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ v("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ v("span", {
					"aria-hidden": "true",
					children: [Hs[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Ks({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ v("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ _("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ _("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ v("li", {
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
export { Us as PlanDiffView, ys as PlanEditor, Tt as bypassTemplate, Fs as createMemoryHub, qt as fromEditorBlocks, Is as localTransport, ti as planSchema, j as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map