import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as ee, useState as u, useSyncExternalStore as te } from "react";
import { BlockNoteView as ne } from "@blocknote/ariakit";
import { MARGIN_NOTES as d, NOT_CONTENT as re, PLAN_BLOCK_CONFIGS as f, PLAN_FRAGMENT as ie, SECTION_ACTIONS as p, applyOps as ae, changeWords as oe, diffPlans as se, findSectionSlot as m, isPlanBlock as ce, isRemovableSlot as le, isRequiredAt as ue, newId as h, optionsOf as de, parseBlock as fe, partitionSections as pe, plainText as me, previewProposal as he, refineInputs as ge, settledBySlot as _e, settledCount as ve, tableCells as ye, templateFor as be, toBlocks as xe, toPlanDocument as Se, usesOf as Ce, validatePlan as we } from "@re-cinq/planning-document";
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
import { Decoration as ct, DecorationSet as E } from "prosemirror-view";
//#region src/blocks/adapters.ts
var lt = n({}), ut = n({ user: {
	id: "",
	name: "Someone"
} });
function D() {
	return i(ut);
}
var O = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
}, k = {
	bar: "_bar_rvpd2_1",
	note: "_note_rvpd2_9",
	refine: "_refine_rvpd2_14",
	quiet: "_quiet_rvpd2_38",
	proposal: "_proposal_rvpd2_54",
	stale: "_stale_rvpd2_64",
	failed: "_failed_rvpd2_65",
	lines: "_lines_rvpd2_71",
	kept: "_kept_rvpd2_79",
	added: "_added_rvpd2_83",
	removed: "_removed_rvpd2_87"
};
//#endregion
//#region src/blocks/InlineChanges.tsx
function dt({ changes: e, hosts: t }) {
	return /* @__PURE__ */ _(g, { children: e.map((e) => /* @__PURE__ */ _(ft, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function ft({ review: e, host: t }) {
	return t ? Te(/* @__PURE__ */ _(pt, { review: e }), t) : null;
}
function pt({ review: e }) {
	return /* @__PURE__ */ v("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: O.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _(gt, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ _(mt, {}),
			/* @__PURE__ */ _(ht, { review: e })
		]
	});
}
function mt() {
	return /* @__PURE__ */ _("p", {
		className: O.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function ht({ review: e }) {
	return /* @__PURE__ */ v("p", {
		className: O.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: k.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: k.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function gt({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ _(_t, { removal: t }) : oe(e).map((e, t) => /* @__PURE__ */ _("p", {
		className: O.words,
		children: e
	}, t));
}
function _t({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : yt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ _("p", {
		className: O.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _("p", {
		className: O.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ _("p", {
		className: O.dropped,
		children: /* @__PURE__ */ _("del", { children: e })
	}, t))] });
}
var vt = {
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
function yt(e) {
	return vt[e] ?? "block";
}
//#endregion
//#region src/template/template-guard.ts
var bt = "planTemplateBypass", xt = "section-heading", St = "blockContent", A = [
	"plan-title",
	xt,
	"section-panel",
	p
], Ct = x({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new C({ filterTransaction: Tt })]
});
function wt(e, t) {
	return e.setMeta(bt, t);
}
function Tt(e, t) {
	if (!e.docChanged || Et(e)) return !0;
	let n = Dt(t.doc), r = Dt(e.doc);
	return It(kt(n), kt(r)) && At(n, r) && Mt(n, r);
}
function Et(e) {
	let t = e.getMeta(Be);
	return !!e.getMeta(bt) || t?.isChangeOrigin === !0;
}
function Dt(e) {
	let t = [];
	return e.descendants((e) => {
		Ot(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Ot(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(St);
}
function kt(e) {
	return e.filter((e) => A.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function At(e, t) {
	return jt(t) === 0 || jt(e) > 0;
}
function jt(e) {
	let t = e.findIndex((e) => e.type === xt);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Mt(e, t) {
	let n = Pt(e);
	return [...Pt(t)].every(([e, t]) => t <= (n.get(e) ?? 0));
}
var Nt = [...d, "answer"];
function Pt(e) {
	let t = /* @__PURE__ */ new Map();
	return e.reduce((e, n) => n.type === xt ? {
		slot: n.slot,
		closed: !1
	} : (e.closed && !Nt.includes(n.type) && t.set(e.slot, (t.get(e.slot) ?? 0) + 1), {
		slot: e.slot,
		closed: e.closed || Ft(n)
	}), {
		slot: "",
		closed: !1
	}), t;
}
function Ft(e) {
	return e.type === p;
}
function It(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Lt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [Ee(({ elements: e, rects: t }) => {
		let n = Bt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Rt() {
	return /* @__PURE__ */ _(ke, {
		floatingUIOptions: Lt,
		sideMenu: zt
	});
}
function zt() {
	let e = Ne(De, { selector: (e) => e?.block.type });
	return e === void 0 || A.includes(e) ? null : /* @__PURE__ */ _(Oe, {});
}
function Bt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Vt(t) : null;
}
function Vt(e) {
	let t = Ht(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Ht(e) {
	let t = Ut(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Wt(n);
}
function Ut(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Wt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Gt(e) {
	return e;
}
function Kt(e) {
	return e.map(fe);
}
function j(e, t) {
	return Se(Kt(e), t);
}
var M = {
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
}, qt = { props: { resolved: !0 } }, Jt = { props: { resolved: !1 } };
function Yt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = ln(F(e));
	return /* @__PURE__ */ v("aside", {
		className: M.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${I(e)}`,
		...Zt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ _(Qt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ _("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ _(Xt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Xt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ v("div", {
		className: M.actions,
		contentEditable: !1,
		children: [P(e) && /* @__PURE__ */ _($t, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ _(en, {
			block: e,
			editor: t
		})]
	});
}
function Zt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Qt({ block: e, resolved: t }) {
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
				children: pn(e.props.at)
			}),
			t && /* @__PURE__ */ _("span", {
				className: M.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function $t({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ _(N, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Jt)
	}) : /* @__PURE__ */ _(an, {
		block: e,
		editor: t
	});
}
function en({ block: e, editor: t }) {
	let [n, r] = u(!1), i = rn(e);
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(N, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ _(tn, {
		question: nn(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function tn({ question: e, onConfirm: t, onCancel: n }) {
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
function nn(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function rn(e) {
	let t = b();
	if (!P(e)) return [e];
	let n = F(e);
	return t.document.filter((e) => e.type === "comment" && F(e) === n);
}
function an({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ v(g, { children: [n ? /* @__PURE__ */ _(on, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ _(N, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ _(N, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, qt)
	})] });
}
function N({ label: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function on({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = cn({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ _("form", {
		className: M.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ _(sn, {
			to: I(e),
			draft: r,
			onDraft: i
		})
	});
}
function sn({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ _("input", {
		className: M.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function cn({ editor: e, block: t }) {
	let { user: n } = D(), r = b();
	return (i) => {
		if (!i) return;
		let a = F(t), o = r.document, s = dn(o, a) ?? t;
		e.insertBlocks([fn(a, i, n.name)], s, "after");
	};
}
function ln(e) {
	let t = b(), n = () => un(t.document, e), [r, i] = u(n);
	return Me(() => i(n())), r;
}
function un(e, t) {
	return e.some((e) => P(e) && F(e) === t && e.props.resolved === !0);
}
function dn(e, t) {
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
function fn(e, t, n) {
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
function pn(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var L = {
	finding: "_finding_d6sjh_1",
	who: "_who_d6sjh_24",
	label: "_label_d6sjh_37",
	why: "_why_d6sjh_41",
	text: "_text_d6sjh_45",
	actions: "_actions_d6sjh_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function mn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ v("aside", {
		className: L.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": _n(r),
		children: [
			/* @__PURE__ */ _(hn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ _("div", {
				className: L.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ _(gn, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function hn({ severity: e, why: t }) {
	return /* @__PURE__ */ v("p", {
		className: L.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("span", {
			className: L.label,
			children: _n(e)
		}), t && /* @__PURE__ */ _("span", {
			className: L.why,
			children: t
		})]
	});
}
function gn({ block: e, editor: t, resolved: n }) {
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
function _n(e) {
	return `Finding · ${e}`;
}
var R = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function vn({ block: e }) {
	let { renderMockup: t } = o(lt);
	return /* @__PURE__ */ v("figure", {
		className: R.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ v("figcaption", {
			className: R.label,
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
var yn = {
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
}, bn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function xn({ spec: e, value: t, onChange: n, readOnly: r }) {
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
		}), a.map((e, t) => /* @__PURE__ */ _(Sn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function Sn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ v("label", {
		className: z.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ _("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), bn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var Cn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function wn(e, t) {
	return e[String(t)] ?? String(t);
}
var B = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function Tn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ v("span", {
		className: B.field,
		"data-field": e,
		children: [/* @__PURE__ */ _("label", {
			className: B.label,
			htmlFor: n,
			children: wn(Cn, e)
		}), /* @__PURE__ */ _(En, {
			...t,
			id: n
		})]
	});
}
function En(e) {
	return e.spec.values ? /* @__PURE__ */ _(Dn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ _(On, { ...e });
}
function Dn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ _("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ _("option", { children: e }, e))
	});
}
function On({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
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
var kn = { maturity: xn };
function An({ block: e, editor: t, contentRef: n }) {
	let r = yn[e.type];
	return /* @__PURE__ */ v("div", {
		className: R.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ _(jn, {
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
function jn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ v("div", {
		className: R.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("p", {
			className: R.head,
			children: [/* @__PURE__ */ _("span", {
				className: R.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ _(Mn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ _(Nn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Mn({ view: e, props: t }) {
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
function Nn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = f[e.type], o = a;
	return r(kn[n] ?? Tn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Pn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Fn({ contentRef: e }) {
	return /* @__PURE__ */ _("h1", {
		className: Pn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var V = {
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
function In({ block: e, editor: t, contentRef: n }) {
	let r = de(e.props.options);
	return /* @__PURE__ */ v("div", {
		className: V.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ _(Ln, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ _("div", {
				className: V.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ _(Rn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Ln({ why: e, picks: t, used: n }) {
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
function Rn({ block: e, editor: t, options: n }) {
	return Wn(Kn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ _(zn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ _(Vn, {
		block: e,
		editor: t
	});
}
function zn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ _("ul", {
		className: V.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Bn, {
			onPick: () => Un(t, e, n),
			children: n
		}) }, n))
	});
}
function Bn({ onPick: e, children: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: V.suggestion,
		onClick: e,
		children: t
	});
}
function Vn({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ v("form", {
		className: V.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Un(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ _(Hn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: V.answerButton,
			children: "Answer"
		})]
	});
}
function Hn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ _("input", {
		className: V.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Un(e, t, n) {
	if (!n) return;
	let r = Kn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Wn(e) {
	let t = b(), [n, r] = u(() => Gn(t.document, e));
	return Me(() => r(Gn(t.document, e))), n;
}
function Gn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Kn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/session/remove-section.ts
function qn(e, t) {
	Ge(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var H = n(null), Jn = n(/* @__PURE__ */ new Map());
function Yn(e) {
	let t = o(H), n = o(Jn).get(e);
	return t ? m(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var Xn = /* @__PURE__ */ new WeakMap();
function Zn(e) {
	let t = Xn.get(e);
	if (t) return t;
	let n = $e(e);
	return Xn.set(e, n), e.once("update", () => Xn.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function Qn(e, t) {
	let n = tr(e);
	return l(() => {
		let n = Zn(e), r = ge(n, t), i = Qe(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ve(r),
			proposal: a,
			busyFor: $n(i, t),
			preview: a?.status === "proposed" ? he(n, a) : void 0,
			...er(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function $n(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function er(e, t, n) {
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
function tr(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function nr(e) {
	let t = Qn(e.doc, e.slot), [n, r] = u(null), i = ir(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ _(rr, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ _(or, { ...a });
}
function rr({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ _(lr, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ _(ur, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ _(dr, {
			...t,
			proposal: e
		});
	}
}
function ir({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = D();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(ar(e));
		});
	};
}
function ar(e) {
	return e instanceof Error ? e.message : String(e);
}
function or({ refine: e, ask: t, refusal: n }) {
	let r = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ v(g, { children: [n && /* @__PURE__ */ _(sr, { reason: n }), /* @__PURE__ */ v("p", {
		className: k.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: k.refine,
			disabled: !r,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ _("span", {
			className: k.note,
			children: cr(e)
		})]
	})] });
}
function sr({ reason: e }) {
	return /* @__PURE__ */ v("p", {
		className: k.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function cr(e) {
	return e.busyFor === void 0 ? e.settled > 0 ? `uses ${vr(e)}` : "Answer a question or resolve a thread to refine" : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function lr({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ v("p", {
		className: k.bar,
		role: "status",
		children: [/* @__PURE__ */ v("span", {
			className: k.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: k.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function ur({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ v("section", {
		className: k.proposal,
		children: [/* @__PURE__ */ v("p", {
			className: k.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ v("p", {
			className: k.bar,
			children: [
				/* @__PURE__ */ _(mr, {
					label: "Ask again",
					run: t,
					disabled: e.busyFor !== void 0
				}),
				/* @__PURE__ */ _(hr, {
					label: "Dismiss",
					run: e.discard
				}),
				/* @__PURE__ */ _(pr, { refine: e })
			]
		})]
	});
}
function dr({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ v("section", {
		className: k.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ v("p", {
				className: k.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					yr(r)
				]
			}),
			/* @__PURE__ */ _(gr, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ v("p", {
				className: k.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ _(fr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function fr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ v("p", {
		className: k.bar,
		children: [
			/* @__PURE__ */ _(mr, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ _(hr, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ _(hr, {
				label: "Discard",
				run: e.discard
			}),
			n && /* @__PURE__ */ _(pr, { refine: e })
		]
	});
}
function pr({ refine: e }) {
	return e.busyFor !== void 0 && /* @__PURE__ */ v("span", {
		className: k.note,
		children: [
			"The agent is refining another section for ",
			e.busyFor,
			"; ask again when it finishes"
		]
	});
}
function mr({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: k.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function hr({ label: e, run: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: k.quiet,
		onClick: t,
		children: e
	});
}
function gr({ lines: e }) {
	return /* @__PURE__ */ _("ul", {
		className: k.lines,
		children: e.map((e, t) => /* @__PURE__ */ _("li", {
			className: k[e.kind],
			children: /* @__PURE__ */ _(_r, { line: e })
		}, `${t}-${e.text}`))
	});
}
function _r({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ _("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ _("del", { children: e.text }) : e.text;
}
function vr({ inputs: e }) {
	return br(e.answered.length, e.resolved.length);
}
function yr({ uses: e }) {
	let t = br(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function br(e, t) {
	return [xr(e, "answer"), xr(t, "resolved thread")].filter(Boolean).join(", ");
}
function xr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var U = {
	actions: "_actions_1ppml_1",
	remove: "_remove_1ppml_10",
	confirm: "_confirm_1ppml_27",
	question: "_question_1ppml_39"
};
//#endregion
//#region src/blocks/SectionActions.tsx
function Sr({ block: e, editor: t }) {
	let { slot: n, title: r } = Dr(e), { onRefine: i, doc: a } = D();
	return !a || !t.isEditable ? null : /* @__PURE__ */ v("div", {
		role: "group",
		className: U.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [i && /* @__PURE__ */ _(nr, {
			doc: a,
			slot: n,
			title: r
		}), /* @__PURE__ */ _(Cr, {
			doc: a,
			slot: n,
			title: r
		})]
	});
}
function Cr({ doc: e, slot: t, title: n }) {
	let r = o(H), [i, a] = u(!1);
	return !r || !le(r, t) ? null : /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _(wr, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ _(Tr, {
		title: n,
		onConfirm: () => qn(e, t),
		onCancel: () => a(!1)
	})] });
}
function wr({ title: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: U.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ _(Er, {})
	});
}
function Tr({ title: e, onConfirm: t, onCancel: n }) {
	let r = `Remove ${e}?`;
	return /* @__PURE__ */ v("div", {
		className: U.confirm,
		role: "dialog",
		"aria-label": r,
		children: [
			/* @__PURE__ */ v("p", {
				className: U.question,
				children: [r, " Its content, comments and questions are deleted."]
			}),
			/* @__PURE__ */ _("button", {
				type: "button",
				onClick: n,
				children: "Cancel"
			}),
			/* @__PURE__ */ _("button", {
				type: "button",
				onClick: t,
				children: "Remove"
			})
		]
	});
}
function Er() {
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
function Dr(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: Yn(t)?.title ?? t
	};
}
var Or = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function kr({ block: e }) {
	let t = Yn(e.props.slot);
	return /* @__PURE__ */ v("header", {
		className: Or.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("h2", {
			className: Or.title,
			children: e.props.title
		}), t && /* @__PURE__ */ _("p", {
			className: Or.hint,
			children: t.hint
		})]
	});
}
var W = {
	panel: "_panel_1ajor_1",
	commentBox: "_commentBox_1ajor_11",
	input: "_input_1ajor_17",
	send: "_send_1ajor_34"
};
//#endregion
//#region src/blocks/SectionPanel.tsx
function Ar({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = Yn(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ _("aside", {
		className: W.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ _(jr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function jr({ block: e, editor: t, title: n }) {
	let { user: r } = D(), [i, a] = u("");
	return /* @__PURE__ */ v("form", {
		className: W.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(Nr({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ _("input", {
			className: W.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ _(Mr, {})]
	});
}
function Mr() {
	return /* @__PURE__ */ _("button", {
		type: "submit",
		className: W.send,
		children: "Comment"
	});
}
function Nr({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([Pr(n, r)], e, "before"), "");
}
function Pr(e, t) {
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
//#endregion
//#region src/blocks/plan-block-specs.tsx
var Fr = { render: An }, Ir = {
	"plan-title": y(f["plan-title"], { render: Fn })(),
	"section-heading": y(f["section-heading"], { render: kr })(),
	"section-panel": y(f["section-panel"], { render: Ar })(),
	"section-actions": y(f["section-actions"], { render: Sr })(),
	comment: y(f.comment, { render: Yt })(),
	finding: y(f.finding, { render: mn })(),
	kpi: y(f.kpi, Fr)(),
	prototype: y(f.prototype, Fr)(),
	mockup: y(f.mockup, { render: vn })(),
	question: y(f.question, { render: In })(),
	answer: y(f.answer, Fr)()
}, Lr = Pe.create({ blockSpecs: {
	...Ve,
	...Ir
} });
//#endregion
//#region src/menu/section-context.ts
function Rr(e, t) {
	let [n] = Br(e, t);
	return n ? String(n.props.slot) : null;
}
function zr(e, t) {
	let n = Br(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Br(e, t) {
	let n = e.slice(0, Vr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Vr(e, t) {
	return e.findIndex((e) => Hr(e, t));
}
function Hr(e, t) {
	return e.id === t || e.children.some((e) => Hr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", Ur = { cells: [
	"",
	"",
	""
] }, Wr = [
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
			rows: [Ur, Ur]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: h("kpi") })
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
		props: () => ({ questionId: h("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = zr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Gr(e, t) {
	return Wr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Kr(e, t));
}
function Kr(e, t) {
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
function qr() {
	let e = b(Lr), t = o(H);
	return /* @__PURE__ */ _(Ae, {
		triggerCharacter: "/",
		getItems: async (n) => Fe(Jr(e, t), n)
	});
}
function Jr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && Yr(t, i);
	return a ? Gr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Ie(e, Gt(t))
	})) : [];
}
function Yr(e, { blocks: t, cursorId: n }) {
	let r = Rr(t, n);
	return r === null ? void 0 : m(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Xr(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		...Zr(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function Zr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ue(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Qr(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var q = {
	outline: "_outline_1r3yu_1",
	phase: "_phase_1r3yu_6",
	slots: "_slots_1r3yu_13",
	title: "_title_1r3yu_21",
	locate: "_locate_1r3yu_22",
	required: "_required_1r3yu_53",
	settled: "_settled_1r3yu_57",
	problems: "_problems_1r3yu_61",
	footer: "_footer_1r3yu_67"
}, $r = [], ei = /* @__PURE__ */ new Map();
function ti({ approval: e = null, children: t, ...n }) {
	return /* @__PURE__ */ v("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ _("p", {
				className: q.phase,
				children: e ? ri(e) : ni(n.report)
			}),
			/* @__PURE__ */ _(ai, { ...n }),
			t && /* @__PURE__ */ _("div", {
				className: q.footer,
				children: t
			})
		]
	});
}
function ni(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function ri({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${ii(t)}`;
}
function ii(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function ai(e) {
	return /* @__PURE__ */ _("ol", {
		className: q.slots,
		children: oi(e).map((e) => /* @__PURE__ */ _(si, { ...e }, e.section.slot))
	});
}
function oi({ template: e, report: t, sections: n = $r, droppedSlots: r, settled: i = ei, onLocate: a }) {
	let o = Qr(t.problems);
	return Xr(e, {
		sections: n,
		droppedSlots: r
	}, t.phase).map((e) => ({
		section: e,
		problems: o.get(e.slot) ?? [],
		settled: i.get(e.slot) ?? 0,
		onLocate: a
	}));
}
function si({ problems: e, settled: t, ...n }) {
	let { section: r } = n;
	return /* @__PURE__ */ v("li", {
		"aria-label": r.title,
		children: [
			/* @__PURE__ */ _(ci, { ...n }),
			r.required && /* @__PURE__ */ _("span", {
				className: q.required,
				children: " required"
			}),
			t > 0 && /* @__PURE__ */ v("span", {
				className: q.settled,
				children: [" ", li(t)]
			}),
			/* @__PURE__ */ _("ul", {
				className: q.problems,
				children: e.map((e) => /* @__PURE__ */ _("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
function ci({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ _("span", {
		className: q.title,
		children: e.title
	}) : /* @__PURE__ */ _("button", {
		type: "button",
		className: q.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function li(e) {
	return `${e} ${e === 1 ? "settled input" : "settled inputs"} waiting for a refine`;
}
var J = {
	editor: "_editor_1495q_1",
	withSidebar: "_withSidebar_1495q_9",
	single: "_single_1495q_13",
	sidebar: "_sidebar_1495q_22"
}, Y = {
	participants: "_participants_64cvt_1",
	locate: "_locate_64cvt_16",
	away: "_away_64cvt_17",
	dot: "_dot_64cvt_38"
}, X = /* @__PURE__ */ "#c32222.#278643.#9213ec.#827517.#287a8a.#e21283.#338618.#2c288a.#cb4f10.#18865d.#82288a.#677f0a.#2272c3.#8a283c.#0b8916.#5f22c3.#8a6a28.#0b847f.#c3229b.#508226.#1337ec.#c33722.#27864f.#ad13ec.#797915.#286d8a.#e21268.#258618.#39288a.#b85d0f.#18866b.#8a2886.#587f0a.#225ec3.#8a2830.#0b8926.#7422c3.#867327.#0b828e.#c32286.#448226.#131bec.#c34b22.#27865b.#c513e7.#6c7915.#28618a.#e7134f.#188618.#45288a".split(".");
function ui(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(di)) t.has(n.userId) || t.set(n.userId, pi(n.color, [...t.values()]));
	return t;
}
function di(e, t) {
	return Number(fi(t)) - Number(fi(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function fi({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function pi(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function mi(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [hi(e, n)]);
}
function hi(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: yi(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: bi(n),
		hasCursor: r != null
	};
}
function gi(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [_i(e, t)] : []);
}
function _i(e, t) {
	return {
		clientId: e,
		userId: yi(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function vi(e, t) {
	let n = e.get(t)?.user, r = n && ui(gi(e)).get(yi(t, n));
	return r === n?.color ? void 0 : r;
}
function yi(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function bi(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function xi(e, t, n) {
	let r = e.slot && m(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Si = "⁠";
function Ci(e) {
	let t = `background-color: var(${Ti(e.id ?? "")}, ${e.color}); color: white`, n = Di("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Di("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Di("bn-collaboration-cursor__base");
	return i.append(Si, r, Si), i;
}
function wi(e, t) {
	t.forEach((t) => e.style.setProperty(Ti(t.id), t.color));
}
function Ti(e) {
	return `--ps-peer-${[...e].map(Ei).join("")}`;
}
function Ei(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Di(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function Oi(e) {
	let [t, n] = u(() => Pi(e));
	return Mi(e, () => n(Pi(e))), t;
}
function ki(e, t) {
	Ni(e, t), Ai(t), ji(e, t);
}
function Ai(e) {
	Mi(e, () => {
		let t = vi(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function ji(e, t) {
	Mi(t, () => {
		let n = e.domElement;
		n && wi(n, Pi(t));
	});
}
function Mi(e, t) {
	let n = ee(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function Ni(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: Rr(r, n.id) });
	}), [e, t]);
}
function Pi(e) {
	return mi(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function Fi({ awareness: e, ...t }) {
	let n = Oi(e);
	return n.length === 0 ? null : /* @__PURE__ */ _("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Ii, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function Ii({ user: e, template: t, titles: n, onLocate: r }) {
	let i = xi(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ _("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: Li,
		onClick: () => r(e),
		children: /* @__PURE__ */ _(Ri, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ _("span", {
		className: Y.away,
		children: /* @__PURE__ */ _(Ri, {
			color: e.color,
			label: i
		})
	});
}
function Li(e) {
	e.preventDefault();
}
function Ri({ color: e, label: t }) {
	return /* @__PURE__ */ v(g, { children: [/* @__PURE__ */ _("svg", {
		className: Y.dot,
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
function zi(e, t) {
	let n = e.prosemirrorView, r = Bi(n, t);
	r !== null && Vi(n, r)?.scrollIntoView({ block: "center" });
}
function Bi(e, t) {
	let [n] = ze.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Vi(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Hi = { notice: "_notice_1xdcv_1" }, Ui = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Wi({ status: e, reason: t }) {
	return /* @__PURE__ */ v("p", {
		className: Hi.notice,
		role: "status",
		"data-status": e,
		children: [Ui[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Gi(e, t) {
	let n = na(e, t);
	return l(() => Ki(e), [e, n]);
}
function Ki(e) {
	let t = new Set(et(e).map((e) => e.changeId)), n = Zn(e);
	return Je(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: Ji(n, r),
		write: () => t.has(r.changeId) ? We(e, r.changeId) : He(e, r.changeId),
		discard: () => Ye(e, r.changeId)
	}));
}
var qi = {
	"remove-block": Yi,
	"set-section-text": Xi,
	"set-section-prose": Xi
};
function Ji(e, t) {
	let n = qi[t.op.op];
	return n && oe(t).length === 0 ? n(e, t) : void 0;
}
function Yi(e, t) {
	let n = e.flatMap(Qi).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: ea(n)
	};
}
function Xi(e, { op: t, slot: n }) {
	let r = new Set(Zi(ae(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Zi(e, n).filter((e) => !r.has(e.id)).flatMap(ea)
	};
}
function Zi(e, t) {
	return pe(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Qi(e) {
	return [e, ...$i(e).flatMap(Qi)];
}
function $i(e) {
	return ce(e) ? [] : e.children;
}
function ea(e) {
	return [ta(e.content), ...$i(e).flatMap(ea)].filter(Boolean);
}
function ta(e) {
	return Array.isArray(e) ? me(e) : ye(e).flat().map(me).join(" · ");
}
function na(e, t) {
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
var ra = "plan-transport", ia = class extends tt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function aa(e) {
	let t = new it(), n = {
		doc: t,
		awareness: new ia(t)
	}, r = sa({
		status: "connecting",
		meta: null
	});
	ua(n, e);
	let i = e.subscribe((e) => la({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => oa(n, i)
	};
}
function oa({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function sa(e) {
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
var ca = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		at(e, w(n), ra), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => at(e, w(t), ra),
	awareness: ({ awareness: e }, { update: t }) => nt(e, w(t), ra),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function la(e, t) {
	ca[t.type](e, t);
}
function ua({ doc: t, awareness: n }, r) {
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
function da(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = aa(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function fa(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var pa = new Le("planChangeWidgets");
function ma(e, t) {
	return x({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new C({
			key: pa,
			props: { decorations: (n) => E.create(n.doc, ha(n, e, t)) }
		})]
	});
}
function ha(e, t, n) {
	let r = ya(e);
	return Je(t).flatMap((e) => {
		let t = ga(r, e);
		return t === void 0 ? [] : [_a(t, e, n)];
	});
}
function ga(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function _a(e, t, n) {
	return ct.widget(e, () => va(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function va(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function ya(e) {
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
var ba = [
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"CapsLock"
];
function xa(e) {
	let { dom: t } = e;
	t instanceof HTMLElement && t.blur();
}
function Sa(e) {
	let { dom: t } = e, n = new AbortController(), { signal: r } = n, i = {
		capture: !0,
		signal: r
	}, { ownerDocument: a } = t;
	a.addEventListener("paste", Ca(t), i), a.addEventListener("pointerup", () => {
		setTimeout(() => n.abort());
	}, i), a.addEventListener("keydown", wa(n), i), a.defaultView?.addEventListener("blur", () => n.abort(), { signal: r });
}
function Ca(e) {
	return (t) => {
		t.target instanceof Node && e.contains(t.target) && (t.preventDefault(), t.stopPropagation());
	};
}
function wa(e) {
	return ({ key: t }) => {
		ba.includes(t) || e.abort();
	};
}
function Ta(e) {
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
var Ea = "Write here…", Da = "paragraph", Oa = "ps-empty-section", ka = [
	...re,
	"question",
	"answer"
], Aa = 0;
function ja(e, t) {
	return Ma(Ta(e)).flatMap((e) => Pa(e, t));
}
function Ma(e) {
	return e.reduce((e, t) => {
		if (t.type === "section-heading") return e.push({
			title: Na(t),
			blocks: [],
			closed: !1
		}), e;
		let n = e.at(-1);
		return n && !n.closed && (n.blocks.push(t), n.closed = t.type === p), e;
	}, []);
}
function Na({ content: e }) {
	return String(e?.attrs.title ?? "");
}
function Pa(e, t) {
	if (e.blocks.some(Fa)) return [];
	let n = e.blocks.find(Ia);
	if (n) return [La(n)];
	let r = e.blocks.find((e) => !d.includes(e.type));
	return r ? [Ra(r, e.title, t)] : [];
}
function Fa(e) {
	return !ka.includes(e.type) && !Ia(e);
}
function Ia({ node: e, content: t, type: n }) {
	return n === Da && e.childCount === 1 && t?.content.size === 0;
}
function La({ pos: e, content: t }) {
	let n = e + 1;
	return ct.node(n, n + (t?.nodeSize ?? 0), { "data-plan-placeholder": Ea });
}
function Ra({ pos: e, node: t }, n, r) {
	let i = String(t.attrs.id ?? "");
	return ct.widget(e, () => za(n, () => r(i)), {
		side: -1,
		key: `empty-${i}-${n}`,
		stopEvent: () => !0
	});
}
function za(e, t) {
	let n = document.createElement("div");
	return n.className = Oa, n.contentEditable = "false", n.role = "button", n.tabIndex = 0, n.ariaLabel = `${Ea} in ${e}`, n.textContent = Ea, n.addEventListener("mousedown", (e) => {
		Ba(e, t);
	}), n.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
	}), n;
}
function Ba(e, t) {
	e.preventDefault(), e.button === Aa && t();
}
function Va(e, t) {
	e.transact(() => {
		let [n] = e.insertBlocks([{ type: Da }], t, "before");
		n && e.setTextCursorPosition(n, "start");
	}), e.focus();
}
//#endregion
//#region src/template/platform.ts
var Ha = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Ua = [
	"Enter",
	"Backspace",
	"Delete"
], Wa = [
	"d",
	"h",
	"k",
	"o",
	"t"
];
function Ga(e) {
	let { key: t, metaKey: n } = e;
	return (Ua.includes(t) || [...t].length === 1) && !n && !Ka(e);
}
function Ka(e) {
	let t = Ha && Wa.includes(e.key);
	return e.ctrlKey && !t && !e.getModifierState("AltGraph");
}
//#endregion
//#region src/template/empty-section.ts
var qa = new Le("planEmptySection"), Z = A.filter((e) => e !== "plan-title"), Ja = ".bn-block-group, .bn-block-outer, .bn-block", Ya = "button, input, textarea, select, a, [role='button']", Xa = ":disabled, [aria-disabled='true']", Za = ["section-panel", "section-actions"], Qa = 1, $a = x(({ editor: e }) => ({
	key: "planEmptySection",
	prosemirrorPlugins: [new C({
		key: qa,
		props: eo(e)
	})]
}))();
function eo(e) {
	let t = (t) => Va(e, t);
	return {
		decorations: (n) => e.isEditable ? E.create(n.doc, ja(n.doc, t)) : E.empty,
		handleDOMEvents: { mousedown: to },
		handleClickOn: bo,
		handleKeyDown: ao,
		handlePaste: io
	};
}
function to(e, t) {
	let n = e.editable && ro(e, t);
	return n && xa(e), (n || ho(e, t.target)) && no(e, t) && Sa(e), n;
}
function no(e, t) {
	return e.editable && t.button === Qa;
}
function ro(e, t) {
	return fo(e, t) || po(e, t);
}
function io(e, t) {
	return e.editable && !lo(t.target) && oo(e);
}
function ao(e, t) {
	return Ga(t) && !lo(t.target) && oo(e);
}
function oo(e) {
	return uo(e.state.selection) || so(e);
}
function so(e) {
	let t = co(e), n = t instanceof Element ? t : t?.parentElement;
	return n && e.dom.contains(n) ? Z.includes(Q(n)) : !1;
}
function co({ root: e, dom: t }) {
	return (e.getSelection?.() ?? t.ownerDocument.getSelection())?.anchorNode;
}
function lo(e) {
	let t = e instanceof Element ? e.closest(Ya) : null;
	return t !== null && !t.matches(Xa);
}
function uo(e) {
	if (!(e instanceof S)) return !1;
	let { type: t } = e.node;
	return Z.includes(t.name);
}
function fo(e, t) {
	return !_o(e, t.target) || !vo(e, t) ? !1 : (t.preventDefault(), !0);
}
function po(e, t) {
	return mo(e, t.target) ? (t.preventDefault(), !0) : !1;
}
function mo(e, t) {
	if (!(t instanceof Element) || !e.dom.contains(t)) return !1;
	let n = Q(t);
	return Z.includes(n) && !lo(t) && !(Za.includes(n) && go(t));
}
function ho(e, t) {
	return t instanceof Element && e.dom.contains(t) && Z.includes(Q(t));
}
function go(e) {
	return [...e.childNodes].some((e) => e instanceof Text && e.data.trim() !== "");
}
function Q(e) {
	return e.closest(".bn-block-content")?.getAttribute("data-content-type") ?? "";
}
function _o(e, t) {
	return t instanceof Element && (t === e.dom || t.matches(Ja));
}
function vo(e, t) {
	let n = Ta(e.state.doc).filter((n) => yo(e, n, t.clientY));
	return n.length > 0 && n.every((e) => Z.includes(e.type));
}
function yo(e, { pos: t }, n) {
	let r = e.nodeDOM(t);
	if (!(r instanceof Element)) return !1;
	let { top: i, bottom: a } = r.getBoundingClientRect();
	return i <= n && n <= a;
}
function bo(...[e, , t]) {
	return e.editable && Z.includes(t.type.name);
}
//#endregion
//#region src/template/section-moves.ts
var xo = {
	ArrowUp: "up",
	ArrowDown: "down"
}, So = 3, Co = 2, wo = x({
	key: "planSectionMoves",
	prosemirrorPlugins: [new C({ props: { handleKeyDown: To } })]
});
function To(e, t) {
	let n = Eo(t);
	if (!n) return !1;
	let r = Ta(e.state.doc), i = Oo(e.state, r), a = i < 0 ? "one-step" : jo(n, r, i);
	return typeof a == "number" && e.dispatch(Fo(e.state, r[i], a)), a !== "one-step";
}
function Eo(e) {
	return Do(e) && e.shiftKey && !e.altKey ? xo[e.key] : void 0;
}
function Do({ metaKey: e, ctrlKey: t }) {
	return Ha ? e && !t : t && !e;
}
function Oo(e, t) {
	let { selection: n } = e;
	return ko(n) ? t.findIndex(({ pos: e, node: t, type: r }) => e < n.from && n.to < e + t.nodeSize && !A.includes(r)) : -1;
}
function ko(e) {
	let { $from: t, $to: n } = e, r = Ao(e);
	return t.depth <= r && n.depth <= r;
}
function Ao(e) {
	return e instanceof S ? Co : e instanceof Re ? So : -1;
}
function jo(e, t, n) {
	return e === "down" ? Mo(t, n) : No(t, n);
}
function Mo(e, t) {
	if (e[t + 1]?.type !== p) return "one-step";
	let n = e.findIndex((e, n) => n > t && e.type === "section-heading");
	return e.find((e, t) => n >= 0 && t > n && !d.includes(e.type))?.pos ?? "nowhere";
}
function No(e, t) {
	let n = e.slice(0, t).reverse(), r = n.find((e) => !d.includes(e.type));
	if (!r || r.type !== "section-heading") return "one-step";
	let i = n.find((e) => e.pos < r.pos && [p, "section-heading"].includes(e.type));
	return i?.type === p ? i.pos : Po(i, r);
}
function Po(e, t) {
	return e ? t.pos : "nowhere";
}
function Fo(e, t, n) {
	let { tr: r, selection: i } = e;
	if (!t) return r;
	let { pos: a, node: o } = t;
	r.delete(a, a + o.nodeSize);
	let s = r.mapping.map(n);
	return r.insert(s, o), r.setSelection(Io(r.doc, i, s - a)).scrollIntoView();
}
function Io(e, t, n) {
	return t instanceof S ? S.create(e, t.from + n) : Re.create(e, t.anchor + n, t.head + n);
}
//#endregion
//#region src/use-plan-editor.ts
function Lo({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = Ro(e, n, i), s = Bo(o, e, a((e) => r?.(j(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => j(s, t), [s, t]),
		hosts: i
	};
}
function Ro(e, t, n) {
	let { doc: r } = e;
	return je(st({
		schema: Lr,
		extensions: zo(r, n),
		collaboration: {
			fragment: r.getXmlFragment(ie),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Ci
		}
	}), [e]);
}
function zo(e, t) {
	return [
		Ct,
		$a,
		wo,
		ma(e, t)
	];
}
function Bo(e, t, n) {
	let [r, i] = u(() => $e(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Vo = {};
function Ho({ transport: e, adapters: t = Vo, className: n, ...r }) {
	let i = da(e), a = Uo(r);
	return /* @__PURE__ */ _(lt, {
		value: t,
		children: /* @__PURE__ */ _("div", {
			className: Wo({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ _(Go, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ _(Wi, { status: "connecting" })
		})
	});
}
function Uo({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function Wo({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function Go({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = fa(t.session);
	if (!r) return /* @__PURE__ */ _(Wi, {
		status: n,
		reason: i
	});
	let a = e ?? be(r.type);
	return /* @__PURE__ */ v(H, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ _(Wi, {
			status: n,
			reason: i
		}), /* @__PURE__ */ _(Ko, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Ko({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = Lo(r), l = qo(i, o, c), ee = ns(s, e, t);
	return ki(o, i.awareness), /* @__PURE__ */ _(ut, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ _(Jo, {
			...r,
			...l,
			...s,
			report: ee
		})
	});
}
function qo(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Jo(e) {
	let t = Xo(e.sections);
	return /* @__PURE__ */ v(Jn, {
		value: t,
		children: [/* @__PURE__ */ _(ts, { ...e }), /* @__PURE__ */ _(Yo, {
			...e,
			titles: t
		})]
	});
}
function Yo({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ v("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ _(Zo, { ...n }), t && /* @__PURE__ */ _(Qo, { ...n })]
	});
}
function Xo(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function Zo({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ _(Fi, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => zi(e, t.clientId)
	});
}
function Qo({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = es(r.sections);
	return /* @__PURE__ */ _(ti, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => $o(e, t),
		children: n
	});
}
function $o(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function es(e) {
	return l(() => _e(xe({ sections: e }), e.map((e) => e.slot)), [e]);
}
function ts({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Gi(n, () => rs(e));
	return /* @__PURE__ */ v(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ _(qr, {}),
			/* @__PURE__ */ _(Rt, {}),
			/* @__PURE__ */ _(dt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function ns(e, t, n) {
	let r = l(() => we(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function rs(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function is(e) {
	let t = Ze(e.blocks), n = new tt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return os(r), {
		doc: t,
		connect: () => cs(r)
	};
}
function as(e) {
	return is(e).connect();
}
function os(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => ss(t, n, {
		type: "update",
		update: T(e)
	})), r.on("update", (n, i) => {
		let a = rt(r, e(n));
		ss(t, i, {
			type: "awareness",
			update: T(a)
		});
	});
}
function ss(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function cs(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ls(e, t, n),
		subscribe: (n) => (t.handlers.add(n), us(e, n), () => t.handlers.delete(n))
	};
}
function ls(e, t, n) {
	if (n.type === "update") {
		at(e.doc, w(n.update), t);
		return;
	}
	nt(e.awareness, w(n.update), t);
}
function us({ doc: e, awareness: t, meta: n }, r) {
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
}, ds = {
	kept: " ",
	added: "+",
	removed: "-"
};
function fs({ before: e, after: t, className: n }) {
	let r = se(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ _(ps, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ _(ms, { section: e }, e.slot)),
			/* @__PURE__ */ _(hs, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function ps({ changes: e }) {
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
function ms({ section: e }) {
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
					children: [ds[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function hs({ what: e, changes: t }) {
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
export { fs as PlanDiffView, Ho as PlanEditor, wt as bypassTemplate, is as createMemoryHub, Kt as fromEditorBlocks, as as localTransport, Lr as planSchema, j as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map