import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { MARGIN_NOTES as f, NOT_CONTENT as ne, PLAN_BLOCK_CONFIGS as p, PLAN_FRAGMENT as re, SECTION_ACTIONS as m, applyOps as ie, changeWords as ae, diffPlans as oe, findSectionSlot as se, isPlanBlock as ce, isRemovableSlot as le, isRequiredAt as ue, newId as h, optionsOf as de, parseBlock as fe, partitionSections as pe, plainText as me, previewProposal as he, refineInputs as ge, settledBySlot as _e, settledCount as ve, tableCells as ye, templateFor as be, toBlocks as xe, toPlanDocument as Se, usesOf as Ce, validatePlan as we } from "@re-cinq/planning-document";
import { createPortal as Te } from "react-dom";
import { Fragment as g, jsx as _, jsxs as v } from "react/jsx-runtime";
import { offset as Ee } from "@floating-ui/react";
import { SideMenuExtension as De } from "@blocknote/core/extensions";
import { SideMenu as Oe, SideMenuController as ke, SuggestionMenuController as Ae, createReactBlockSpec as y, useBlockNoteEditor as b, useCreateBlockNote as je, useEditorChange as Me, useExtensionState as Ne } from "@blocknote/react";
import { BlockNoteSchema as Pe, createExtension as x, filterSuggestionItems as Fe, insertOrUpdateBlockForSlashMenu as Ie } from "@blocknote/core";
import { NodeSelection as S, Plugin as C, PluginKey as Le, TextSelection as Re } from "prosemirror-state";
import { yCursorPluginKey as ze, ySyncPluginKey as Be } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as Ve, acceptChange as He, acceptRefine as Ue, applyChangeAnyway as We, applyOpsToDoc as Ge, applyRefineAnyway as Ke, askRefine as qe, changesIn as Je, discardChange as Ye, discardRefine as Xe, docFromBlocks as Ze, fromBase64 as w, proposalsIn as Qe, readBlocks as $e, staleChanges as et, toBase64 as T } from "@re-cinq/planning-yjs";
import { Awareness as tt, applyAwarenessUpdate as nt, encodeAwarenessUpdate as rt } from "y-protocols/awareness";
import { Doc as it, applyUpdate as at, encodeStateAsUpdate as ot } from "yjs";
import { withCollaboration as st } from "@blocknote/core/yjs";
import { Decoration as ct, DecorationSet as lt } from "prosemirror-view";
//#region src/blocks/adapters.ts
var ut = n({}), dt = n({ user: {
	id: "",
	name: "Someone"
} });
function E() {
	return i(dt);
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
function ft({ changes: e, hosts: t }) {
	return /* @__PURE__ */ _(g, { children: e.map((e) => /* @__PURE__ */ _(pt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function pt({ review: e, host: t }) {
	return t ? Te(/* @__PURE__ */ _(mt, { review: e }), t) : null;
}
function mt({ review: e }) {
	return /* @__PURE__ */ v("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: D.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(_t, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ _(ht, {}),
			/* @__PURE__ */ _(gt, { review: e })
		]
	});
}
function ht() {
	return /* @__PURE__ */ _("p", {
		className: D.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function gt({ review: e }) {
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
function _t({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ _(vt, { removal: t }) : ae(e).map((e, t) => /* @__PURE__ */ _("p", {
		className: D.words,
		children: e
	}, t));
}
function vt({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : bt(e.type);
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
var yt = {
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
function bt(e) {
	return yt[e] ?? "block";
}
//#endregion
//#region src/template/template-guard.ts
var xt = "planTemplateBypass", St = "section-heading", Ct = "blockContent", k = [
	"plan-title",
	St,
	"section-panel",
	m
], wt = x({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new C({ filterTransaction: Et })]
});
function Tt(e, t) {
	return e.setMeta(xt, t);
}
function Et(e, t) {
	if (!e.docChanged || Dt(e)) return !0;
	let n = Ot(t.doc), r = Ot(e.doc);
	return Lt(At(n), At(r)) && jt(n, r) && Nt(n, r);
}
function Dt(e) {
	let t = e.getMeta(Be);
	return !!e.getMeta(xt) || t?.isChangeOrigin === !0;
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
	return e.filter((e) => k.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function jt(e, t) {
	return Mt(t) === 0 || Mt(e) > 0;
}
function Mt(e) {
	let t = e.findIndex((e) => e.type === St);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Nt(e, t) {
	let n = Ft(e);
	return [...Ft(t)].every(([e, t]) => t <= (n.get(e) ?? 0));
}
var Pt = [...f, "answer"];
function Ft(e) {
	let t = /* @__PURE__ */ new Map();
	return e.reduce((e, n) => n.type === St ? {
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
	middleware: [Ee(({ elements: e, rects: t }) => {
		let n = Vt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function zt() {
	return /* @__PURE__ */ _(ke, {
		floatingUIOptions: Rt,
		sideMenu: Bt
	});
}
function Bt() {
	let e = Ne(De, { selector: (e) => e?.block.type });
	return e === void 0 || k.includes(e) ? null : /* @__PURE__ */ _(Oe, {});
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
	return e.map(fe);
}
function A(e, t) {
	return Se(qt(e), t);
}
var j = {
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
	let r = !!e.props.replyTo, i = un(P(e));
	return /* @__PURE__ */ v("aside", {
		className: j.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${F(e)}`,
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
				className: j.text,
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
		className: j.actions,
		contentEditable: !1,
		children: [N(e) && /* @__PURE__ */ _(en, {
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
		className: j.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: j.author,
				children: F(e)
			}),
			/* @__PURE__ */ _("time", {
				className: j.when,
				children: mn(e.props.at)
			}),
			t && /* @__PURE__ */ _("span", {
				className: j.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function en({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ _(M, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Yt)
	}) : /* @__PURE__ */ _(on, {
		block: e,
		editor: t
	});
}
function tn({ block: e, editor: t }) {
	let [n, r] = d(!1), i = an(e);
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(M, {
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
		className: j.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("p", {
				className: j.question,
				children: e
			}),
			/* @__PURE__ */ _(M, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ _(M, {
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
	if (!N(e)) return [e];
	let n = P(e);
	return t.document.filter((e) => e.type === "comment" && P(e) === n);
}
function on({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ v(g, { children: [n ? /* @__PURE__ */ _(sn, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ _(M, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ _(M, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Jt)
	})] });
}
function M({ label: e, onClick: t }) {
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
		className: j.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ _(cn, {
			to: F(e),
			draft: r,
			onDraft: i
		})
	});
}
function cn({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ _("input", {
		className: j.input,
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
		let a = P(t), o = r.document, s = fn(o, a) ?? t;
		e.insertBlocks([pn(a, i, n.name)], s, "after");
	};
}
function un(e) {
	let t = b(), n = () => dn(t.document, e), [r, i] = d(n);
	return Me(() => i(n())), r;
}
function dn(e, t) {
	return e.some((e) => N(e) && P(e) === t && e.props.resolved === !0);
}
function fn(e, t) {
	return e.filter((e) => e.type === "comment" && P(e) === t).at(-1);
}
function N(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function P(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function F(e) {
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
var I = {
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
		className: I.finding,
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
				className: I.text,
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
		className: I.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("span", {
			className: I.label,
			children: vn(e)
		}), t && /* @__PURE__ */ _("span", {
			className: I.why,
			children: t
		})]
	});
}
function _n({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: I.actions,
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
var L = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function yn({ block: e }) {
	let { renderMockup: t } = o(ut);
	return /* @__PURE__ */ v("figure", {
		className: L.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ v("figcaption", {
			className: L.label,
			children: [
				"Mockup (",
				e.props.format,
				")"
			]
		}), t ? t(e.props) : /* @__PURE__ */ _("p", { children: "The host renders mockups; none is configured." })]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var bn = {
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
}, R = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, xn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function Sn({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: R.steps,
		disabled: r
	};
	return /* @__PURE__ */ v("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ _("legend", {
			className: R.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ _(Cn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function Cn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ v("label", {
		className: R.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ _("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), xn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var wn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function Tn(e, t) {
	return e[String(t)] ?? String(t);
}
var z = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function En({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ v("span", {
		className: z.field,
		"data-field": e,
		children: [/* @__PURE__ */ _("label", {
			className: z.label,
			htmlFor: n,
			children: Tn(wn, e)
		}), /* @__PURE__ */ _(Dn, {
			...t,
			id: n
		})]
	});
}
function Dn(e) {
	return e.spec.values ? /* @__PURE__ */ _(On, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ _(kn, { ...e });
}
function On({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ _("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ _("option", { children: e }, e))
	});
}
function kn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ _("input", {
		id: e,
		className: z.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var An = { maturity: Sn };
function jn({ block: e, editor: t, contentRef: n }) {
	let r = bn[e.type];
	return /* @__PURE__ */ v("div", {
		className: L.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ _(Mn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ _("div", {
			className: L.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function Mn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ v("div", {
		className: L.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("p", {
			className: L.head,
			children: [/* @__PURE__ */ _("span", {
				className: L.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ _(Nn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ _(Pn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Nn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ v("a", {
		className: L.link,
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
function Pn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = p[e.type], o = a;
	return r(An[n] ?? En, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Fn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function In({ contentRef: e }) {
	return /* @__PURE__ */ _("h1", {
		className: Fn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var B = {
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
function Ln({ block: e, editor: t, contentRef: n }) {
	let r = de(e.props.options);
	return /* @__PURE__ */ v("div", {
		className: B.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ _(Rn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ _("div", {
				className: B.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ _(zn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Rn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ _("p", {
		className: B.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ _("span", {
			className: B.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ v("p", {
		className: B.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: B.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ _("span", {
				className: B.why,
				children: e
			}),
			/* @__PURE__ */ _("span", {
				className: B.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function zn({ block: e, editor: t, options: n }) {
	return Gn(qn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ _(Bn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ _(Hn, {
		block: e,
		editor: t
	});
}
function Bn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ _("ul", {
		className: B.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Vn, {
			onPick: () => Wn(t, e, n),
			children: n
		}) }, n))
	});
}
function Vn({ onPick: e, children: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: B.suggestion,
		onClick: e,
		children: t
	});
}
function Hn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ v("form", {
		className: B.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Wn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ _(Un, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: B.answerButton,
			children: "Answer"
		})]
	});
}
function Un({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ _("input", {
		className: B.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Wn(e, t, n) {
	if (!n) return;
	let r = qn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Gn(e) {
	let t = b(), [n, r] = d(() => Kn(t.document, e));
	return Me(() => r(Kn(t.document, e))), n;
}
function Kn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function qn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/session/remove-section.ts
function Jn(e, t) {
	Ge(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var V = n(null), Yn = n(/* @__PURE__ */ new Map());
function Xn(e) {
	let t = o(V), n = o(Yn).get(e);
	return t ? se(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var Zn = /* @__PURE__ */ new WeakMap();
function Qn(e) {
	let t = Zn.get(e);
	if (t) return t;
	let n = $e(e);
	return Zn.set(e, n), e.once("update", () => Zn.delete(e)), n;
}
//#endregion
//#region src/session/use-doc-version.ts
function $n(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
//#endregion
//#region src/session/use-section-refine.ts
function er(e, t) {
	let n = $n(e);
	return l(() => {
		let n = Qn(e), r = ge(n, t), i = Qe(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ve(r),
			proposal: a,
			busyFor: tr(i, t),
			preview: a?.status === "proposed" ? he(n, a) : void 0,
			...nr(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function tr(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function nr(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: Ce(n),
			baseHash: qe(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Ue(e, t),
		applyAnyway: () => void Ke(e, t),
		discard: () => Xe(e, t)
	};
}
//#endregion
//#region src/blocks/RefineControls.tsx
function rr(e) {
	let t = er(e.doc, e.slot), [n, r] = d(null), i = ar(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ _(ir, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ _(sr, { ...a });
}
function ir({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ _(fr, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ _(pr, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ _(mr, {
			...t,
			proposal: e
		});
	}
}
function ar({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = E();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(or(e));
		});
	};
}
function or(e) {
	return e instanceof Error ? e.message : String(e);
}
function sr({ refine: e, ask: t, refusal: n }) {
	let r = e.settled === 0 && e.busyFor === void 0;
	return /* @__PURE__ */ v(g, { children: [n && /* @__PURE__ */ _(ur, { reason: n }), r ? /* @__PURE__ */ _(cr, {}) : /* @__PURE__ */ _(lr, {
		refine: e,
		ask: t
	})] });
}
function cr() {
	return /* @__PURE__ */ _("p", {
		className: O.hint,
		children: "Nothing for the agent to refine yet. Answer a question in this section or resolve a comment, and Refine appears here."
	});
}
function lr({ refine: e, ask: t }) {
	let n = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		children: [/* @__PURE__ */ _(_r, {
			label: "Refine this section",
			run: t,
			disabled: !n
		}), /* @__PURE__ */ _("span", {
			className: O.note,
			children: dr(e)
		})]
	});
}
function ur({ reason: e }) {
	return /* @__PURE__ */ v("p", {
		className: O.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function dr(e) {
	return e.busyFor === void 0 ? `uses ${xr(e)}` : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function fr({ refine: e, askedBy: t }) {
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
function pr({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ v("section", {
		className: O.proposal,
		children: [/* @__PURE__ */ v("p", {
			className: O.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ v("p", {
			className: O.bar,
			children: [
				/* @__PURE__ */ _(_r, {
					label: "Ask again",
					run: t,
					disabled: e.busyFor !== void 0
				}),
				/* @__PURE__ */ _(vr, {
					label: "Dismiss",
					run: e.discard
				}),
				/* @__PURE__ */ _(gr, { refine: e })
			]
		})]
	});
}
function mr({ refine: e, ask: t, title: n, proposal: r }) {
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
					Sr(r)
				]
			}),
			/* @__PURE__ */ _(yr, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ _(hr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function hr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		children: [
			/* @__PURE__ */ _(_r, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ _(vr, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ _(vr, {
				label: "Discard",
				run: e.discard
			}),
			n && /* @__PURE__ */ _(gr, { refine: e })
		]
	});
}
function gr({ refine: e }) {
	return e.busyFor !== void 0 && /* @__PURE__ */ v("span", {
		className: O.note,
		children: [
			"The agent is refining another section for ",
			e.busyFor,
			"; ask again when it finishes"
		]
	});
}
function _r({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: O.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function vr({ label: e, run: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: O.quiet,
		onClick: t,
		children: e
	});
}
function yr({ lines: e }) {
	return /* @__PURE__ */ _("ul", {
		className: O.lines,
		children: e.map((e, t) => /* @__PURE__ */ _("li", {
			className: O[e.kind],
			children: /* @__PURE__ */ _(br, { line: e })
		}, `${t}-${e.text}`))
	});
}
function br({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ _("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ _("del", { children: e.text }) : e.text;
}
function xr({ inputs: e }) {
	return Cr(e.answered.length, e.resolved.length);
}
function Sr({ uses: e }) {
	let t = Cr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Cr(e, t) {
	return [wr(e, "answer"), wr(t, "resolved thread")].filter(Boolean).join(", ");
}
function wr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var H = {
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
function Tr({ block: e, editor: t }) {
	let { slot: n, title: r } = Mr(e), { onRefine: i, doc: a } = E();
	return !a || !t.isEditable ? null : /* @__PURE__ */ v("div", {
		role: "group",
		className: H.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [i && /* @__PURE__ */ _(rr, {
			doc: a,
			slot: n,
			title: r
		}), /* @__PURE__ */ _(Er, {
			doc: a,
			slot: n,
			title: r
		})]
	});
}
function Er({ doc: e, slot: t, title: n }) {
	let r = o(V), [i, a] = d(!1);
	return !r || !le(r, t) ? null : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(Dr, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ _(Or, {
		title: n,
		onConfirm: () => Jn(e, t),
		onCancel: () => a(!1)
	})] });
}
function Dr({ title: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: H.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ _(jr, {})
	});
}
function Or({ title: e, onConfirm: t, onCancel: n }) {
	let r = kr(), i = c();
	return /* @__PURE__ */ v("dialog", {
		ref: r,
		className: H.confirm,
		"aria-labelledby": i,
		onClose: n,
		children: [
			/* @__PURE__ */ v("h3", {
				id: i,
				className: H.question,
				children: [
					"Remove ",
					e,
					"?"
				]
			}),
			/* @__PURE__ */ _("p", {
				className: H.explanation,
				children: "Its content, comments and questions are deleted."
			}),
			/* @__PURE__ */ _(Ar, {
				onConfirm: t,
				onCancel: n
			})
		]
	});
}
function kr() {
	let e = u(null);
	return s(() => e.current?.showModal(), []), e;
}
function Ar({ onConfirm: e, onCancel: t }) {
	return /* @__PURE__ */ v("div", {
		className: H.choices,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: H.cancel,
			autoFocus: !0,
			onClick: t,
			children: "Cancel"
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: H.danger,
			onClick: e,
			children: "Remove"
		})]
	});
}
function jr() {
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
function Mr(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: Xn(t)?.title ?? t
	};
}
var Nr = {
	composer: "_composer_in3m5_1",
	input: "_input_in3m5_8",
	send: "_send_in3m5_25"
};
//#endregion
//#region src/blocks/CommentComposer.tsx
function Pr(e) {
	let { draft: t, setDraft: n, say: r } = Fr(e), { title: i } = e.block.props;
	return /* @__PURE__ */ v("form", {
		className: Nr.composer,
		onSubmit: r,
		children: [/* @__PURE__ */ _(Ir, {
			title: i,
			draft: t,
			onDraft: n,
			onLeave: e.onDone
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: Nr.send,
			children: "Comment"
		})]
	});
}
function Fr({ block: e, editor: t, onDone: n }) {
	let { user: r } = E(), [i, a] = d("");
	return {
		draft: i,
		setDraft: a,
		say: (a) => {
			let o = i.trim();
			a.preventDefault(), o && (t.insertBlocks([Lr(o, r.name)], e, "after"), n());
		}
	};
}
function Ir({ title: e, draft: t, onDraft: n, onLeave: r }) {
	return /* @__PURE__ */ _("input", {
		className: Nr.input,
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
function Lr(e, t) {
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
var U = {
	heading: "_heading_80g3h_1",
	row: "_row_80g3h_10",
	comment: "_comment_80g3h_17",
	title: "_title_80g3h_44",
	hint: "_hint_80g3h_52"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function Rr({ block: e, editor: t }) {
	let [n, r] = d(!1), { slot: i, title: a } = e.props;
	return /* @__PURE__ */ v("header", {
		className: U.heading,
		"data-slot": i,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(Br, {
				title: a,
				commentable: t.isEditable,
				open: n,
				onToggle: () => r(!n)
			}),
			/* @__PURE__ */ _(zr, { slot: i }),
			n && /* @__PURE__ */ _(Pr, {
				block: e,
				editor: t,
				onDone: () => r(!1)
			})
		]
	});
}
function zr({ slot: e }) {
	let t = Xn(e)?.hint;
	return t && /* @__PURE__ */ _("p", {
		className: U.hint,
		children: t
	});
}
function Br({ title: e, commentable: t, open: n, onToggle: r }) {
	return /* @__PURE__ */ v("div", {
		className: U.row,
		children: [/* @__PURE__ */ _("h2", {
			className: U.title,
			children: e
		}), t && /* @__PURE__ */ _(Vr, {
			title: e,
			open: n,
			onToggle: r
		})]
	});
}
function Vr({ title: e, open: t, onToggle: n }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: U.comment,
		"aria-expanded": t,
		"aria-label": `${t ? "Close comment" : "Comment"} on ${e}`,
		onMouseDown: (e) => e.preventDefault(),
		onClick: n,
		children: [/* @__PURE__ */ _(Hr, {}), "Comment"]
	});
}
function Hr() {
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
function Ur() {
	return null;
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var Wr = { render: jn }, Gr = {
	"plan-title": y(p["plan-title"], { render: In })(),
	"section-heading": y(p["section-heading"], { render: Rr })(),
	"section-panel": y(p["section-panel"], { render: Ur })(),
	"section-actions": y(p["section-actions"], { render: Tr })(),
	comment: y(p.comment, { render: Xt })(),
	finding: y(p.finding, { render: hn })(),
	kpi: y(p.kpi, Wr)(),
	prototype: y(p.prototype, Wr)(),
	mockup: y(p.mockup, { render: yn })(),
	question: y(p.question, { render: Ln })(),
	answer: y(p.answer, Wr)()
}, Kr = Pe.create({ blockSpecs: {
	...Ve,
	...Gr
} });
//#endregion
//#region src/menu/section-context.ts
function qr(e, t) {
	let [n] = Yr(e, t);
	return n ? String(n.props.slot) : null;
}
function Jr(e, t) {
	let n = Yr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Yr(e, t) {
	let n = e.slice(0, Xr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Xr(e, t) {
	return e.findIndex((e) => Zr(e, t));
}
function Zr(e, t) {
	return e.id === t || e.children.some((e) => Zr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var W = "Text", G = "Plan", Qr = { cells: [
	"",
	"",
	""
] }, $r = [
	{
		kind: "paragraph",
		title: "Paragraph",
		group: W,
		aliases: ["p"]
	},
	{
		kind: "heading",
		title: "Heading",
		group: W,
		aliases: ["h2"],
		props: () => ({ level: 2 })
	},
	{
		kind: "heading",
		title: "Subheading",
		group: W,
		aliases: ["h3"],
		props: () => ({ level: 3 })
	},
	{
		kind: "bulletListItem",
		title: "Bullet list",
		group: W,
		aliases: ["ul"]
	},
	{
		kind: "numberedListItem",
		title: "Numbered list",
		group: W,
		aliases: ["ol"]
	},
	{
		kind: "checkListItem",
		title: "Checklist",
		group: W,
		aliases: ["todo"]
	},
	{
		kind: "quote",
		title: "Quote",
		group: W
	},
	{
		kind: "codeBlock",
		title: "Code",
		group: W
	},
	{
		kind: "table",
		title: "Table",
		group: W,
		content: {
			type: "tableContent",
			rows: [Qr, Qr]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: G,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: h("kpi") })
	},
	{
		kind: "prototype",
		title: "Prototype",
		group: G
	},
	{
		kind: "mockup",
		title: "Mockup",
		group: G
	},
	{
		kind: "question",
		title: "Question",
		group: G,
		props: () => ({ questionId: h("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: G,
		props: (e) => {
			let t = Jr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function ei(e, t) {
	return $r.filter((t) => e.allows.includes(t.kind)).flatMap((e) => ti(e, t));
}
function ti(e, t) {
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
function ni() {
	let e = b(Kr), t = o(V);
	return /* @__PURE__ */ _(Ae, {
		triggerCharacter: "/",
		getItems: async (n) => Fe(ri(e, t), n)
	});
}
function ri(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && ii(t, i);
	return a ? ei(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Ie(e, Kt(t))
	})) : [];
}
function ii(e, { blocks: t, cursorId: n }) {
	let r = qr(t, n);
	return r === null ? void 0 : se(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function ai(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		...oi(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function oi(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ue(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function si(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
//#endregion
//#region src/outline/section-state.ts
function ci(e, t) {
	return t.length > 0 ? "problem" : e.inPlan ? "ready" : "missing";
}
function li(e) {
	let t = e.filter(({ section: e }) => e.required);
	return {
		ready: t.filter(({ section: e, problems: t }) => ci(e, t) === "ready").length,
		total: t.length
	};
}
var K = {
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
}, ui = [], di = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ new Map();
function pi({ approval: e = null, children: t, ...n }) {
	let r = yi(n);
	return /* @__PURE__ */ v("nav", {
		className: K.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ _("p", {
				className: K.phase,
				children: hi(e, n.report)
			}),
			!e && /* @__PURE__ */ _(mi, { ...li(r) }),
			/* @__PURE__ */ _("ol", {
				className: K.slots,
				children: r.map((e) => /* @__PURE__ */ _(Si, { ...e }, e.section.slot))
			}),
			t && /* @__PURE__ */ _("div", {
				className: K.footer,
				children: t
			})
		]
	});
}
function mi({ ready: e, total: t }) {
	return t === 0 ? null : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ v("p", {
		className: K.progress,
		children: [
			e,
			" of ",
			t,
			" required sections ready"
		]
	}), /* @__PURE__ */ _("progress", {
		className: K.bar,
		"aria-label": "Required sections ready",
		value: e,
		max: t
	})] });
}
function hi(e, t) {
	return e ? _i(e) : gi(t);
}
function gi(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function _i({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${vi(t)}`;
}
function vi(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function yi({ template: e, report: t, sections: n = ui, droppedSlots: r, settled: i = di, failed: a = fi, onLocate: o }) {
	let s = si(t.problems);
	return ai(e, {
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
var bi = {
	ready: "ready",
	problem: "needs work",
	missing: "not in the plan"
}, xi = {
	ready: "✓",
	problem: "!",
	missing: ""
};
function Si({ problems: e, settled: t, failure: n, ...r }) {
	let { section: i } = r, a = ci(i, e);
	return /* @__PURE__ */ v("li", {
		className: K.slot,
		"aria-label": `${i.title}, ${bi[a]}`,
		children: [
			/* @__PURE__ */ _(Ci, { state: a }),
			/* @__PURE__ */ _(Ei, { ...r }),
			i.required && /* @__PURE__ */ _("span", {
				className: K.required,
				children: "required"
			}),
			/* @__PURE__ */ _(wi, {
				problems: e,
				settled: t,
				failure: n
			})
		]
	});
}
function Ci({ state: e }) {
	return /* @__PURE__ */ _("span", {
		className: K.mark,
		"aria-hidden": "true",
		"data-state": e,
		children: xi[e]
	});
}
function wi({ problems: e, settled: t, failure: n }) {
	return /* @__PURE__ */ v(g, { children: [
		/* @__PURE__ */ _(Ti, { text: t > 0 && Di(t) }),
		/* @__PURE__ */ _(Ti, { text: n && `Refine failed: ${n}` }),
		/* @__PURE__ */ _("ul", {
			className: K.problems,
			children: e.map((e) => /* @__PURE__ */ _("li", { children: e.message }, `${e.code}-${e.message}`))
		})
	] });
}
function Ti({ text: e }) {
	return e && /* @__PURE__ */ _("span", {
		className: K.settled,
		children: e
	});
}
function Ei({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ _("span", {
		className: K.title,
		children: e.title
	}) : /* @__PURE__ */ _("button", {
		type: "button",
		className: K.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function Di(e) {
	return `${e} ${e === 1 ? "settled input" : "settled inputs"} waiting for a refine`;
}
var q = {
	editor: "_editor_1ajpy_1",
	withSidebar: "_withSidebar_1ajpy_9",
	single: "_single_1ajpy_13",
	sidebar: "_sidebar_1ajpy_22"
}, J = {
	participants: "_participants_ogqfd_1",
	locate: "_locate_ogqfd_16",
	away: "_away_ogqfd_17",
	dot: "_dot_ogqfd_42"
}, Y = /* @__PURE__ */ "#c32222.#278643.#9213ec.#827517.#287a8a.#e21283.#338618.#2c288a.#cb4f10.#18865d.#82288a.#677f0a.#2272c3.#8a283c.#0b8916.#5f22c3.#8a6a28.#0b847f.#c3229b.#508226.#1337ec.#c33722.#27864f.#ad13ec.#797915.#286d8a.#e21268.#258618.#39288a.#b85d0f.#18866b.#8a2886.#587f0a.#225ec3.#8a2830.#0b8926.#7422c3.#867327.#0b828e.#c32286.#448226.#131bec.#c34b22.#27865b.#c513e7.#6c7915.#28618a.#e7134f.#188618.#45288a".split(".");
function Oi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(ki)) t.has(n.userId) || t.set(n.userId, ji(n.color, [...t.values()]));
	return t;
}
function ki(e, t) {
	return Number(Ai(t)) - Number(Ai(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Ai({ color: e }) {
	return e !== void 0 && Y.includes(e);
}
function ji(e, t) {
	let n = Y.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? Y[t.length % Y.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Mi(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Ni(e, n)]);
}
function Ni(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Li(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? Y[0]),
		slot: Ri(n),
		hasCursor: r != null
	};
}
function Pi(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Fi(e, t)] : []);
}
function Fi(e, t) {
	return {
		clientId: e,
		userId: Li(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Ii(e, t) {
	let n = e.get(t)?.user, r = n && Oi(Pi(e)).get(Li(t, n));
	return r === n?.color ? void 0 : r;
}
function Li(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Ri(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function zi(e, t, n) {
	let r = e.slot && se(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Bi = "⁠";
function Vi(e) {
	let t = `background-color: var(${Ui(e.id ?? "")}, ${e.color}); color: white`, n = Gi("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Gi("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Gi("bn-collaboration-cursor__base");
	return i.append(Bi, r, Bi), i;
}
function Hi(e, t) {
	t.forEach((t) => e.style.setProperty(Ui(t.id), t.color));
}
function Ui(e) {
	return `--ps-peer-${[...e].map(Wi).join("")}`;
}
function Wi(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Gi(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function Ki(e) {
	let [t, n] = d(() => Qi(e));
	return Xi(e, () => n(Qi(e))), t;
}
function qi(e, t) {
	Zi(e, t), Ji(t), Yi(e, t);
}
function Ji(e) {
	Xi(e, () => {
		let t = Ii(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function Yi(e, t) {
	Xi(t, () => {
		let n = e.domElement;
		n && Hi(n, Qi(t));
	});
}
function Xi(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function Zi(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: qr(r, n.id) });
	}), [e, t]);
}
function Qi(e) {
	return Mi(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function $i({ awareness: e, ...t }) {
	let n = Ki(e);
	return n.length === 0 ? null : /* @__PURE__ */ _("ul", {
		className: J.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(ea, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function ea({ user: e, template: t, titles: n, onLocate: r }) {
	let i = zi(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ _("button", {
		type: "button",
		className: J.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: ta,
		onClick: () => r(e),
		children: /* @__PURE__ */ _(na, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ _("span", {
		className: J.away,
		children: /* @__PURE__ */ _(na, {
			color: e.color,
			label: i
		})
	});
}
function ta(e) {
	e.preventDefault();
}
function na({ color: e, label: t }) {
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _("svg", {
		className: J.dot,
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
function ra(e, t) {
	let n = e.prosemirrorView, r = ia(n, t);
	r !== null && aa(n, r)?.scrollIntoView({ block: "center" });
}
function ia(e, t) {
	let [n] = ze.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function aa(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
//#endregion
//#region src/session/refine-failures.ts
function oa(e, t) {
	return e.flatMap((e) => e.status === "failed" ? [{
		slot: e.slot,
		title: t.get(e.slot) ?? e.slot,
		reason: e.reason
	}] : []);
}
function sa(e, t, n) {
	let r = $n(e), i = l(() => oa(Qe(e), t), [
		e,
		t,
		r
	]);
	return ca(i, n), l(() => new Map(i.map(({ slot: e, reason: t }) => [e, t])), [i]);
}
function ca(e, t) {
	let n = u(void 0), r = JSON.stringify(e);
	s(() => {
		n.current !== r && (n.current = r, t?.(e));
	});
}
var la = { notice: "_notice_1xdcv_1" }, ua = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function X({ status: e, reason: t }) {
	return /* @__PURE__ */ v("p", {
		className: la.notice,
		role: "status",
		"data-status": e,
		children: [ua[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function da(e, t) {
	let n = Sa(e, t);
	return l(() => fa(e), [e, n]);
}
function fa(e) {
	let t = new Set(et(e).map((e) => e.changeId)), n = Qn(e);
	return Je(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: ma(n, r),
		write: () => t.has(r.changeId) ? We(e, r.changeId) : He(e, r.changeId),
		discard: () => Ye(e, r.changeId)
	}));
}
var pa = {
	"remove-block": ha,
	"set-section-text": ga,
	"set-section-prose": ga
};
function ma(e, t) {
	let n = pa[t.op.op];
	return n && ae(t).length === 0 ? n(e, t) : void 0;
}
function ha(e, t) {
	let n = e.flatMap(va).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: ba(n)
	};
}
function ga(e, { op: t, slot: n }) {
	let r = new Set(_a(ie(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: _a(e, n).filter((e) => !r.has(e.id)).flatMap(ba)
	};
}
function _a(e, t) {
	return pe(e).find((e) => e.slot === t)?.blocks ?? [];
}
function va(e) {
	return [e, ...ya(e).flatMap(va)];
}
function ya(e) {
	return ce(e) ? [] : e.children;
}
function ba(e) {
	return [xa(e.content), ...ya(e).flatMap(ba)].filter(Boolean);
}
function xa(e) {
	return Array.isArray(e) ? me(e) : ye(e).flat().map(me).join(" · ");
}
function Sa(e, t) {
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
var Ca = "plan-transport", wa = class extends tt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Ta(e) {
	let t = new it(), n = {
		doc: t,
		awareness: new wa(t)
	}, r = Da({
		status: "connecting",
		meta: null
	});
	Aa(n, e);
	let i = e.subscribe((e) => ka({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Ea(n, i)
	};
}
function Ea({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Da(e) {
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
var Oa = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		at(e, w(n), Ca), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => at(e, w(t), Ca),
	awareness: ({ awareness: e }, { update: t }) => nt(e, w(t), Ca),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function ka(e, t) {
	Oa[t.type](e, t);
}
function Aa({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: T(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = rt(n, e(t));
		r.send({
			type: "awareness",
			update: T(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function ja(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = Ta(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Ma(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Na = new Le("planChangeWidgets");
function Pa(e, t) {
	return x({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new C({
			key: Na,
			props: { decorations: (n) => lt.create(n.doc, Fa(n, e, t)) }
		})]
	});
}
function Fa(e, t, n) {
	let r = za(e);
	return Je(t).flatMap((e) => {
		let t = Ia(r, e);
		return t === void 0 ? [] : [La(t, e, n)];
	});
}
function Ia(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function La(e, t, n) {
	return ct.widget(e, () => Ra(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Ra(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function za(e) {
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
var Ba = [
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"CapsLock"
];
function Va(e) {
	let { dom: t } = e;
	t instanceof HTMLElement && t.blur();
}
function Ha(e) {
	let { dom: t } = e, n = new AbortController(), { signal: r } = n, i = {
		capture: !0,
		signal: r
	}, { ownerDocument: a } = t;
	a.addEventListener("paste", Ua(t), i), a.addEventListener("pointerup", () => {
		setTimeout(() => n.abort());
	}, i), a.addEventListener("keydown", Wa(n), i), a.defaultView?.addEventListener("blur", () => n.abort(), { signal: r });
}
function Ua(e) {
	return (t) => {
		t.target instanceof Node && e.contains(t.target) && (t.preventDefault(), t.stopPropagation());
	};
}
function Wa(e) {
	return ({ key: t }) => {
		Ba.includes(t) || e.abort();
	};
}
function Ga(e) {
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
var Ka = "Write here…", qa = "paragraph", Ja = "ps-empty-section", Ya = [
	...ne,
	"question",
	"answer"
], Xa = 0;
function Za(e, t) {
	return Qa(Ga(e)).flatMap((e) => eo(e, t));
}
function Qa(e) {
	return e.reduce((e, t) => {
		if (t.type === "section-heading") return e.push({
			title: $a(t),
			blocks: [],
			closed: !1
		}), e;
		let n = e.at(-1);
		return n && !n.closed && (n.blocks.push(t), n.closed = t.type === m), e;
	}, []);
}
function $a({ content: e }) {
	return String(e?.attrs.title ?? "");
}
function eo(e, t) {
	if (e.blocks.some(to)) return [];
	let n = e.blocks.find(no);
	if (n) return [ro(n)];
	let r = e.blocks.find((e) => !f.includes(e.type));
	return r ? [io(r, e.title, t)] : [];
}
function to(e) {
	return !Ya.includes(e.type) && !no(e);
}
function no({ node: e, content: t, type: n }) {
	return n === qa && e.childCount === 1 && t?.content.size === 0;
}
function ro({ pos: e, content: t }) {
	let n = e + 1;
	return ct.node(n, n + (t?.nodeSize ?? 0), { "data-plan-placeholder": Ka });
}
function io({ pos: e, node: t }, n, r) {
	let i = String(t.attrs.id ?? "");
	return ct.widget(e, () => ao(n, () => r(i)), {
		side: -1,
		key: `empty-${i}-${n}`,
		stopEvent: () => !0
	});
}
function ao(e, t) {
	let n = document.createElement("div");
	return n.className = Ja, n.contentEditable = "false", n.role = "button", n.tabIndex = 0, n.ariaLabel = `${Ka} in ${e}`, n.textContent = Ka, n.addEventListener("mousedown", (e) => {
		oo(e, t);
	}), n.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
	}), n;
}
function oo(e, t) {
	e.preventDefault(), e.button === Xa && t();
}
function so(e, t) {
	e.transact(() => {
		let [n] = e.insertBlocks([{ type: qa }], t, "before");
		n && e.setTextCursorPosition(n, "start");
	}), e.focus();
}
//#endregion
//#region src/template/platform.ts
var co = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), lo = [
	"Enter",
	"Backspace",
	"Delete"
], uo = [
	"d",
	"h",
	"k",
	"o",
	"t"
];
function fo(e) {
	let { key: t, metaKey: n } = e;
	return (lo.includes(t) || [...t].length === 1) && !n && !po(e);
}
function po(e) {
	let t = co && uo.includes(e.key);
	return e.ctrlKey && !t && !e.getModifierState("AltGraph");
}
//#endregion
//#region src/template/empty-section.ts
var mo = new Le("planEmptySection"), Z = k.filter((e) => e !== "plan-title"), ho = ".bn-block-group, .bn-block-outer, .bn-block", go = "button, input, textarea, select, a, [role='button']", _o = ":disabled, [aria-disabled='true']", vo = ["section-panel", "section-actions"], yo = 1, bo = x(({ editor: e }) => ({
	key: "planEmptySection",
	prosemirrorPlugins: [new C({
		key: mo,
		props: xo(e)
	})]
}))();
function xo(e) {
	let t = (t) => so(e, t);
	return {
		decorations: (n) => e.isEditable ? lt.create(n.doc, Za(n.doc, t)) : lt.empty,
		handleDOMEvents: { mousedown: So },
		handleClickOn: Bo,
		handleKeyDown: Eo,
		handlePaste: To
	};
}
function So(e, t) {
	let n = e.editable && wo(e, t);
	return n && Va(e), (n || Fo(e, t.target)) && Co(e, t) && Ha(e), n;
}
function Co(e, t) {
	return e.editable && t.button === yo;
}
function wo(e, t) {
	return Mo(e, t) || No(e, t);
}
function To(e, t) {
	return e.editable && !Ao(t.target) && Do(e);
}
function Eo(e, t) {
	return fo(t) && !Ao(t.target) && Do(e);
}
function Do(e) {
	return jo(e.state.selection) || Oo(e);
}
function Oo(e) {
	let t = ko(e), n = t instanceof Element ? t : t?.parentElement;
	return n && e.dom.contains(n) ? Z.includes(Q(n)) : !1;
}
function ko({ root: e, dom: t }) {
	return (e.getSelection?.() ?? t.ownerDocument.getSelection())?.anchorNode;
}
function Ao(e) {
	let t = e instanceof Element ? e.closest(go) : null;
	return t !== null && !t.matches(_o);
}
function jo(e) {
	if (!(e instanceof S)) return !1;
	let { type: t } = e.node;
	return Z.includes(t.name);
}
function Mo(e, t) {
	return !Lo(e, t.target) || !Ro(e, t) ? !1 : (t.preventDefault(), !0);
}
function No(e, t) {
	return Po(e, t.target) ? (t.preventDefault(), !0) : !1;
}
function Po(e, t) {
	if (!(t instanceof Element) || !e.dom.contains(t)) return !1;
	let n = Q(t);
	return Z.includes(n) && !Ao(t) && !(vo.includes(n) && Io(t));
}
function Fo(e, t) {
	return t instanceof Element && e.dom.contains(t) && Z.includes(Q(t));
}
function Io(e) {
	return [...e.childNodes].some((e) => e instanceof Text && e.data.trim() !== "");
}
function Q(e) {
	return e.closest(".bn-block-content")?.getAttribute("data-content-type") ?? "";
}
function Lo(e, t) {
	return t instanceof Element && (t === e.dom || t.matches(ho));
}
function Ro(e, t) {
	let n = Ga(e.state.doc).filter((n) => zo(e, n, t.clientY));
	return n.length > 0 && n.every((e) => Z.includes(e.type));
}
function zo(e, { pos: t }, n) {
	let r = e.nodeDOM(t);
	if (!(r instanceof Element)) return !1;
	let { top: i, bottom: a } = r.getBoundingClientRect();
	return i <= n && n <= a;
}
function Bo(...[e, , t]) {
	return e.editable && Z.includes(t.type.name);
}
//#endregion
//#region src/template/section-moves.ts
var Vo = {
	ArrowUp: "up",
	ArrowDown: "down"
}, Ho = 3, Uo = 2, Wo = x({
	key: "planSectionMoves",
	prosemirrorPlugins: [new C({ props: { handleKeyDown: Go } })]
});
function Go(e, t) {
	let n = Ko(t);
	if (!n) return !1;
	let r = Ga(e.state.doc), i = Jo(e.state, r), a = i < 0 ? "one-step" : Zo(n, r, i);
	return typeof a == "number" && e.dispatch(ts(e.state, r[i], a)), a !== "one-step";
}
function Ko(e) {
	return qo(e) && e.shiftKey && !e.altKey ? Vo[e.key] : void 0;
}
function qo({ metaKey: e, ctrlKey: t }) {
	return co ? e && !t : t && !e;
}
function Jo(e, t) {
	let { selection: n } = e;
	return Yo(n) ? t.findIndex(({ pos: e, node: t, type: r }) => e < n.from && n.to < e + t.nodeSize && !k.includes(r)) : -1;
}
function Yo(e) {
	let { $from: t, $to: n } = e, r = Xo(e);
	return t.depth <= r && n.depth <= r;
}
function Xo(e) {
	return e instanceof S ? Uo : e instanceof Re ? Ho : -1;
}
function Zo(e, t, n) {
	return e === "down" ? Qo(t, n) : $o(t, n);
}
function Qo(e, t) {
	if (e[t + 1]?.type !== m) return "one-step";
	let n = e.findIndex((e, n) => n > t && e.type === "section-heading");
	return e.find((e, t) => n >= 0 && t > n && !f.includes(e.type))?.pos ?? "nowhere";
}
function $o(e, t) {
	let n = e.slice(0, t).reverse(), r = n.find((e) => !f.includes(e.type));
	if (!r || r.type !== "section-heading") return "one-step";
	let i = n.find((e) => e.pos < r.pos && [m, "section-heading"].includes(e.type));
	return i?.type === m ? i.pos : es(i, r);
}
function es(e, t) {
	return e ? t.pos : "nowhere";
}
function ts(e, t, n) {
	let { tr: r, selection: i } = e;
	if (!t) return r;
	let { pos: a, node: o } = t;
	r.delete(a, a + o.nodeSize);
	let s = r.mapping.map(n);
	return r.insert(s, o), r.setSelection(ns(r.doc, i, s - a)).scrollIntoView();
}
function ns(e, t, n) {
	return t instanceof S ? S.create(e, t.from + n) : Re.create(e, t.anchor + n, t.head + n);
}
//#endregion
//#region src/use-plan-editor.ts
function rs({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = is(e, n, i), s = os(o, e, a((e) => r?.(A(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => A(s, t), [s, t]),
		hosts: i
	};
}
function is(e, t, n) {
	let { doc: r } = e;
	return je(st({
		schema: Kr,
		extensions: as(r, n),
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Vi
		}
	}), [e]);
}
function as(e, t) {
	return [
		wt,
		bo,
		Wo,
		Pa(e, t)
	];
}
function os(e, t, n) {
	let [r, i] = d(() => $e(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var ss = {};
function cs({ transport: e, adapters: t = ss, className: n, ...r }) {
	let i = ja(e), a = ls(r);
	return /* @__PURE__ */ _(ut, {
		value: t,
		children: /* @__PURE__ */ _("div", {
			className: us({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ _(ds, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ _(X, { status: "connecting" })
		})
	});
}
function ls({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function us({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? q.withSidebar : q.single;
	return [
		q.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ds({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Ma(t.session);
	if (!r) return /* @__PURE__ */ _(X, {
		status: n,
		reason: i
	});
	let a = e ?? be(r.type);
	return /* @__PURE__ */ v(V, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ _(X, {
			status: n,
			reason: i
		}), /* @__PURE__ */ _(fs, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function fs({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = rs(r), l = ps(i, o, c), u = Ss(s, e, t);
	return qi(o, i.awareness), /* @__PURE__ */ _(dt, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ _(ms, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function ps(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function ms({ onRefineFailures: e, ...t }) {
	let n = gs(t.sections), r = sa(t.doc, n, e);
	return /* @__PURE__ */ v(Yn, {
		value: n,
		children: [/* @__PURE__ */ _(xs, { ...t }), /* @__PURE__ */ _(hs, {
			...t,
			titles: n,
			failed: r
		})]
	});
}
function hs({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ v("aside", {
		className: q.sidebar,
		children: [e && /* @__PURE__ */ _(_s, { ...n }), t && /* @__PURE__ */ _(vs, { ...n })]
	});
}
function gs(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function _s({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ _($i, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => ra(e, t.clientId)
	});
}
function vs({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = bs(r.sections);
	return /* @__PURE__ */ _(pi, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => ys(e, t),
		children: n
	});
}
function ys(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function bs(e) {
	return l(() => _e(xe({ sections: e }), e.map((e) => e.slot)), [e]);
}
function xs({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = da(n, () => Cs(e));
	return /* @__PURE__ */ v(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ _(ni, {}),
			/* @__PURE__ */ _(zt, {}),
			/* @__PURE__ */ _(ft, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Ss(e, t, n) {
	let r = l(() => we(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Cs(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ws(e) {
	let t = Ze(e.blocks), n = new tt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Es(r), {
		doc: t,
		connect: () => Os(r)
	};
}
function Ts(e) {
	return ws(e).connect();
}
function Es(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Ds(t, n, {
		type: "update",
		update: T(e)
	})), r.on("update", (n, i) => {
		let a = rt(r, e(n));
		Ds(t, i, {
			type: "awareness",
			update: T(a)
		});
	});
}
function Ds(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Os(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ks(e, t, n),
		subscribe: (n) => (t.handlers.add(n), As(e, n), () => t.handlers.delete(n))
	};
}
function ks(e, t, n) {
	if (n.type === "update") {
		at(e.doc, w(n.update), t);
		return;
	}
	nt(e.awareness, w(n.update), t);
}
function As({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: T(ot(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = rt(t, i);
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
}, js = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Ms({ before: e, after: t, className: n }) {
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
			/* @__PURE__ */ _(Ns, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ _(Ps, { section: e }, e.slot)),
			/* @__PURE__ */ _(Fs, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Ns({ changes: e }) {
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
function Ps({ section: e }) {
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
					children: [js[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Fs({ what: e, changes: t }) {
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
export { Ms as PlanDiffView, cs as PlanEditor, Tt as bypassTemplate, ws as createMemoryHub, qt as fromEditorBlocks, Ts as localTransport, Kr as planSchema, A as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map