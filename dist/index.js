import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as ee, useMemo as c, useRef as te, useState as l, useSyncExternalStore as ne } from "react";
import { BlockNoteView as re } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as u, PLAN_FRAGMENT as ie, applyOps as ae, changeWords as oe, diffPlans as se, findSectionSlot as d, isPlanBlock as ce, isRemovableSlot as le, isRequiredAt as ue, newId as f, optionsOf as de, parseBlock as fe, partitionSections as pe, plainText as me, previewProposal as he, refineInputs as ge, settledBySlot as _e, settledCount as ve, tableCells as ye, templateFor as be, toBlocks as xe, toPlanDocument as Se, usesOf as Ce, validatePlan as we } from "@re-cinq/planning-document";
import { createPortal as Te } from "react-dom";
import { Fragment as p, jsx as m, jsxs as h } from "react/jsx-runtime";
import { offset as Ee } from "@floating-ui/react";
import { SideMenuExtension as De } from "@blocknote/core/extensions";
import { SideMenu as Oe, SideMenuController as ke, SuggestionMenuController as Ae, createReactBlockSpec as g, useBlockNoteEditor as _, useCreateBlockNote as je, useEditorChange as Me, useExtensionState as Ne } from "@blocknote/react";
import { BlockNoteSchema as Pe, createExtension as Fe, filterSuggestionItems as Ie, insertOrUpdateBlockForSlashMenu as Le } from "@blocknote/core";
import { Plugin as Re, PluginKey as ze } from "prosemirror-state";
import { yCursorPluginKey as Be, ySyncPluginKey as Ve } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as He, acceptChange as Ue, acceptRefine as We, applyChangeAnyway as Ge, applyOpsToDoc as Ke, applyRefineAnyway as qe, askRefine as Je, changesIn as Ye, discardChange as Xe, discardRefine as Ze, docFromBlocks as Qe, fromBase64 as v, proposalsIn as $e, readBlocks as et, staleChanges as tt, toBase64 as y } from "@re-cinq/planning-yjs";
import { Awareness as nt, applyAwarenessUpdate as rt, encodeAwarenessUpdate as b } from "y-protocols/awareness";
import { Doc as it, applyUpdate as x, encodeStateAsUpdate as at } from "yjs";
import { withCollaboration as ot } from "@blocknote/core/yjs";
import { Decoration as st, DecorationSet as ct } from "prosemirror-view";
//#region src/blocks/adapters.ts
var lt = n({}), ut = n({ user: {
	id: "",
	name: "Someone"
} });
function S() {
	return i(ut);
}
var C = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
}, w = {
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
function dt({ changes: e, hosts: t }) {
	return /* @__PURE__ */ m(p, { children: e.map((e) => /* @__PURE__ */ m(ft, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function ft({ review: e, host: t }) {
	return t ? Te(/* @__PURE__ */ m(pt, { review: e }), t) : null;
}
function pt({ review: e }) {
	return /* @__PURE__ */ h("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: C.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ m(gt, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ m(mt, {}),
			/* @__PURE__ */ m(ht, { review: e })
		]
	});
}
function mt() {
	return /* @__PURE__ */ m("p", {
		className: C.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function ht({ review: e }) {
	return /* @__PURE__ */ h("p", {
		className: C.bar,
		children: [/* @__PURE__ */ m("button", {
			type: "button",
			className: w.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ m("button", {
			type: "button",
			className: w.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function gt({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ m(_t, { removal: t }) : oe(e).map((e, t) => /* @__PURE__ */ m("p", {
		className: C.words,
		children: e
	}, t));
}
function _t({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : yt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ m("p", {
		className: C.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ h(p, { children: [/* @__PURE__ */ m("p", {
		className: C.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ m("p", {
		className: C.dropped,
		children: /* @__PURE__ */ m("del", { children: e })
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
var bt = "planTemplateBypass", xt = "section-heading", St = "blockContent", Ct = [
	"plan-title",
	xt,
	"section-panel",
	"section-actions"
], wt = Fe({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Re({ filterTransaction: Et })]
});
function Tt(e, t) {
	return e.setMeta(bt, t);
}
function Et(e, t) {
	if (!e.docChanged || Dt(e)) return !0;
	let n = Ot(t.doc), r = Ot(e.doc);
	return Nt(At(n), At(r)) && jt(n, r);
}
function Dt(e) {
	let t = e.getMeta(Ve);
	return !!e.getMeta(bt) || t?.isChangeOrigin === !0;
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
	return (t.group ?? "").split(" ").includes(St);
}
function At(e) {
	return e.filter((e) => Ct.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function jt(e, t) {
	return Mt(t) === 0 || Mt(e) > 0;
}
function Mt(e) {
	let t = e.findIndex((e) => e.type === xt);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Nt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Pt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [Ee(({ elements: e, rects: t }) => {
		let n = Lt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Ft() {
	return /* @__PURE__ */ m(ke, {
		floatingUIOptions: Pt,
		sideMenu: It
	});
}
function It() {
	let e = Ne(De, { selector: (e) => e?.block.type });
	return e === void 0 || Ct.includes(e) ? null : /* @__PURE__ */ m(Oe, {});
}
function Lt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Rt(t) : null;
}
function Rt(e) {
	let t = zt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function zt(e) {
	let t = Bt(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Vt(n);
}
function Bt(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Vt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Ht(e) {
	return e;
}
function Ut(e) {
	return e.map(fe);
}
function T(e, t) {
	return Se(Ut(e), t);
}
var E = {
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
}, Wt = { props: { resolved: !0 } }, Gt = { props: { resolved: !1 } };
function Kt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = on(k(e));
	return /* @__PURE__ */ h("aside", {
		className: E.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${A(e)}`,
		...Jt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ m(Yt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ m("div", {
				className: E.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ m(qt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function qt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: E.actions,
		contentEditable: !1,
		children: [O(e) && /* @__PURE__ */ m(Xt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ m(Zt, {
			block: e,
			editor: t
		})]
	});
}
function Jt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Yt({ block: e, resolved: t }) {
	return /* @__PURE__ */ h("p", {
		className: E.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ m("span", {
				className: E.author,
				children: A(e)
			}),
			/* @__PURE__ */ m("time", {
				className: E.when,
				children: un(e.props.at)
			}),
			t && /* @__PURE__ */ m("span", {
				className: E.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Xt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ m(D, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Gt)
	}) : /* @__PURE__ */ m(tn, {
		block: e,
		editor: t
	});
}
function Zt({ block: e, editor: t }) {
	let [n, r] = l(!1), i = en(e);
	return /* @__PURE__ */ h(p, { children: [/* @__PURE__ */ m(D, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ m(Qt, {
		question: $t(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function Qt({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ h("div", {
		className: E.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ m("p", {
				className: E.question,
				children: e
			}),
			/* @__PURE__ */ m(D, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ m(D, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function $t(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function en(e) {
	let t = _();
	if (!O(e)) return [e];
	let n = k(e);
	return t.document.filter((e) => e.type === "comment" && k(e) === n);
}
function tn({ block: e, editor: t }) {
	let [n, r] = l(!1);
	return /* @__PURE__ */ h(p, { children: [n ? /* @__PURE__ */ m(nn, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ m(D, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ m(D, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Wt)
	})] });
}
function D({ label: e, onClick: t }) {
	return /* @__PURE__ */ m("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function nn({ block: e, editor: t, onDone: n }) {
	let [r, i] = l(""), a = an({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ m("form", {
		className: E.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ m(rn, {
			to: A(e),
			draft: r,
			onDraft: i
		})
	});
}
function rn({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ m("input", {
		className: E.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function an({ editor: e, block: t }) {
	let { user: n } = S(), r = _();
	return (i) => {
		if (!i) return;
		let a = k(t), o = r.document, s = cn(o, a) ?? t;
		e.insertBlocks([ln(a, i, n.name)], s, "after");
	};
}
function on(e) {
	let t = _(), n = () => sn(t.document, e), [r, i] = l(n);
	return Me(() => i(n())), r;
}
function sn(e, t) {
	return e.some((e) => O(e) && k(e) === t && e.props.resolved === !0);
}
function cn(e, t) {
	return e.filter((e) => e.type === "comment" && k(e) === t).at(-1);
}
function O(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function k(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function A(e) {
	return String(e.props.author || "Someone");
}
function ln(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: f("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function un(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var j = {
	finding: "_finding_d6sjh_1",
	who: "_who_d6sjh_24",
	label: "_label_d6sjh_37",
	why: "_why_d6sjh_41",
	text: "_text_d6sjh_45",
	actions: "_actions_d6sjh_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function dn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ h("aside", {
		className: j.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": mn(r),
		children: [
			/* @__PURE__ */ m(fn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ m("div", {
				className: j.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ m(pn, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function fn({ severity: e, why: t }) {
	return /* @__PURE__ */ h("p", {
		className: j.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ m("span", {
			className: j.label,
			children: mn(e)
		}), t && /* @__PURE__ */ m("span", {
			className: j.why,
			children: t
		})]
	});
}
function pn({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ m("div", {
		className: j.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ m("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function mn(e) {
	return `Finding · ${e}`;
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
function hn({ block: e }) {
	let { renderMockup: t } = o(lt);
	return /* @__PURE__ */ h("figure", {
		className: M.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ h("figcaption", {
			className: M.label,
			children: [
				"Mockup (",
				e.props.format,
				")"
			]
		}), t ? t(e.props) : /* @__PURE__ */ m("p", { children: "The host renders mockups; none is configured." })]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var gn = {
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
}, _n = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function vn({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = ee(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: N.steps,
		disabled: r
	};
	return /* @__PURE__ */ h("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ m("legend", {
			className: N.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ m(yn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function yn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ h("label", {
		className: N.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ m("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), _n[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var bn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function xn(e, t) {
	return e[String(t)] ?? String(t);
}
var P = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function Sn({ name: e, ...t }) {
	let n = ee();
	return /* @__PURE__ */ h("span", {
		className: P.field,
		"data-field": e,
		children: [/* @__PURE__ */ m("label", {
			className: P.label,
			htmlFor: n,
			children: xn(bn, e)
		}), /* @__PURE__ */ m(Cn, {
			...t,
			id: n
		})]
	});
}
function Cn(e) {
	return e.spec.values ? /* @__PURE__ */ m(wn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ m(Tn, { ...e });
}
function wn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ m("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ m("option", { children: e }, e))
	});
}
function Tn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ m("input", {
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
var En = { maturity: vn };
function Dn({ block: e, editor: t, contentRef: n }) {
	let r = gn[e.type];
	return /* @__PURE__ */ h("div", {
		className: M.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ m(On, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ m("div", {
			className: M.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function On({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ h("div", {
		className: M.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("p", {
			className: M.head,
			children: [/* @__PURE__ */ m("span", {
				className: M.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ m(kn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ m(An, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function kn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ h("a", {
		className: M.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ m("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function An({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = u[e.type], o = a;
	return r(En[n] ?? Sn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var jn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Mn({ contentRef: e }) {
	return /* @__PURE__ */ m("h1", {
		className: jn.title,
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
function Nn({ block: e, editor: t, contentRef: n }) {
	let r = de(e.props.options);
	return /* @__PURE__ */ h("div", {
		className: F.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ m(Pn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ m("div", {
				className: F.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ m(Fn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Pn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ m("p", {
		className: F.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ m("span", {
			className: F.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ h("p", {
		className: F.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ m("span", {
				className: F.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ m("span", {
				className: F.why,
				children: e
			}),
			/* @__PURE__ */ m("span", {
				className: F.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Fn({ block: e, editor: t, options: n }) {
	return Vn(Un(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ m(In, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ m(Rn, {
		block: e,
		editor: t
	});
}
function In({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ m("ul", {
		className: F.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ m(Ln, {
			onPick: () => Bn(t, e, n),
			children: n
		}) }, n))
	});
}
function Ln({ onPick: e, children: t }) {
	return /* @__PURE__ */ m("button", {
		type: "button",
		className: F.suggestion,
		onClick: e,
		children: t
	});
}
function Rn({ block: e, editor: t }) {
	let [n, r] = l("");
	return /* @__PURE__ */ h("form", {
		className: F.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Bn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ m(zn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ m("button", {
			type: "submit",
			className: F.answerButton,
			children: "Answer"
		})]
	});
}
function zn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ m("input", {
		className: F.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Bn(e, t, n) {
	if (!n) return;
	let r = Un(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Vn(e) {
	let t = _(), [n, r] = l(() => Hn(t.document, e));
	return Me(() => r(Hn(t.document, e))), n;
}
function Hn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Un(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/session/remove-section.ts
function Wn(e, t) {
	Ke(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var I = n(null), Gn = n(/* @__PURE__ */ new Map());
function L(e) {
	let t = o(I), n = o(Gn).get(e);
	return t ? d(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var R = /* @__PURE__ */ new WeakMap();
function Kn(e) {
	let t = R.get(e);
	if (t) return t;
	let n = et(e);
	return R.set(e, n), e.once("update", () => R.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function qn(e, t) {
	let n = Xn(e);
	return c(() => {
		let n = Kn(e), r = ge(n, t), i = $e(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ve(r),
			proposal: a,
			busyFor: Jn(i, t),
			preview: a?.status === "proposed" ? he(n, a) : void 0,
			...Yn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Jn(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function Yn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: Ce(n),
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
function Xn(e) {
	let [t, n] = l(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Zn(e) {
	let t = qn(e.doc, e.slot), [n, r] = l(null), i = $n(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ m(Qn, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ m(tr, { ...a });
}
function Qn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ m(ir, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ m(ar, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ m(or, {
			...t,
			proposal: e
		});
	}
}
function $n({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = S();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(er(e));
		});
	};
}
function er(e) {
	return e instanceof Error ? e.message : String(e);
}
function tr({ refine: e, ask: t, refusal: n }) {
	let r = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ h(p, { children: [n && /* @__PURE__ */ m(nr, { reason: n }), /* @__PURE__ */ h("p", {
		className: w.bar,
		children: [/* @__PURE__ */ m("button", {
			type: "button",
			className: w.refine,
			disabled: !r,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ m("span", {
			className: w.note,
			children: rr(e)
		})]
	})] });
}
function nr({ reason: e }) {
	return /* @__PURE__ */ h("p", {
		className: w.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function rr(e) {
	return e.busyFor === void 0 ? e.settled > 0 ? `uses ${dr(e)}` : "Answer a question or resolve a thread to refine" : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function ir({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ h("p", {
		className: w.bar,
		role: "status",
		children: [/* @__PURE__ */ h("span", {
			className: w.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ m("button", {
			type: "button",
			className: w.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function ar({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ h("section", {
		className: w.proposal,
		children: [/* @__PURE__ */ h("p", {
			className: w.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ h("p", {
			className: w.bar,
			children: [/* @__PURE__ */ m(cr, {
				label: "Ask again",
				run: t,
				disabled: e.busyFor !== void 0
			}), /* @__PURE__ */ m(z, {
				label: "Dismiss",
				run: e.discard
			})]
		})]
	});
}
function or({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ h("section", {
		className: w.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ h("p", {
				className: w.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					fr(r)
				]
			}),
			/* @__PURE__ */ m(lr, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ h("p", {
				className: w.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ m(sr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function sr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ h("p", {
		className: w.bar,
		children: [
			/* @__PURE__ */ m(cr, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ m(z, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ m(z, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function cr({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ m("button", {
		type: "button",
		className: w.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function z({ label: e, run: t }) {
	return /* @__PURE__ */ m("button", {
		type: "button",
		className: w.quiet,
		onClick: t,
		children: e
	});
}
function lr({ lines: e }) {
	return /* @__PURE__ */ m("ul", {
		className: w.lines,
		children: e.map((e, t) => /* @__PURE__ */ m("li", {
			className: w[e.kind],
			children: /* @__PURE__ */ m(ur, { line: e })
		}, `${t}-${e.text}`))
	});
}
function ur({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ m("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ m("del", { children: e.text }) : e.text;
}
function dr({ inputs: e }) {
	return pr(e.answered.length, e.resolved.length);
}
function fr({ uses: e }) {
	let t = pr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function pr(e, t) {
	return [mr(e, "answer"), mr(t, "resolved thread")].filter(Boolean).join(", ");
}
function mr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var B = {
	actions: "_actions_1ppml_1",
	remove: "_remove_1ppml_10",
	confirm: "_confirm_1ppml_27",
	question: "_question_1ppml_39"
};
//#endregion
//#region src/blocks/SectionActions.tsx
function hr({ block: e, editor: t }) {
	let { slot: n, title: r } = br(e), { onRefine: i, doc: a } = S();
	return !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: B.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [i && /* @__PURE__ */ m(Zn, {
			doc: a,
			slot: n,
			title: r
		}), /* @__PURE__ */ m(gr, {
			doc: a,
			slot: n,
			title: r
		})]
	});
}
function gr({ doc: e, slot: t, title: n }) {
	let r = o(I), [i, a] = l(!1);
	return !r || !le(r, t) ? null : /* @__PURE__ */ h(p, { children: [/* @__PURE__ */ m(_r, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ m(vr, {
		title: n,
		onConfirm: () => Wn(e, t),
		onCancel: () => a(!1)
	})] });
}
function _r({ title: e, onClick: t }) {
	return /* @__PURE__ */ m("button", {
		type: "button",
		className: B.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ m(yr, {})
	});
}
function vr({ title: e, onConfirm: t, onCancel: n }) {
	let r = `Remove ${e}?`;
	return /* @__PURE__ */ h("div", {
		className: B.confirm,
		role: "dialog",
		"aria-label": r,
		children: [
			/* @__PURE__ */ h("p", {
				className: B.question,
				children: [r, " Its content, comments and questions are deleted."]
			}),
			/* @__PURE__ */ m("button", {
				type: "button",
				onClick: n,
				children: "Cancel"
			}),
			/* @__PURE__ */ m("button", {
				type: "button",
				onClick: t,
				children: "Remove"
			})
		]
	});
}
function yr() {
	return /* @__PURE__ */ m("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ m("path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" })
	});
}
function br(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: L(t)?.title ?? t
	};
}
var V = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function xr({ block: e }) {
	let t = L(e.props.slot);
	return /* @__PURE__ */ h("header", {
		className: V.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ m("h2", {
			className: V.title,
			children: e.props.title
		}), t && /* @__PURE__ */ m("p", {
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
function Sr({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = L(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ m("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ m(Cr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function Cr({ block: e, editor: t, title: n }) {
	let { user: r } = S(), [i, a] = l("");
	return /* @__PURE__ */ h("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(Tr({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ m("input", {
			className: H.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ m(wr, {})]
	});
}
function wr() {
	return /* @__PURE__ */ m("button", {
		type: "submit",
		className: H.send,
		children: "Comment"
	});
}
function Tr({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([Er(n, r)], e, "before"), "");
}
function Er(e, t) {
	return {
		type: "comment",
		props: {
			commentId: f("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var U = { render: Dn }, Dr = {
	"plan-title": g(u["plan-title"], { render: Mn })(),
	"section-heading": g(u["section-heading"], { render: xr })(),
	"section-panel": g(u["section-panel"], { render: Sr })(),
	"section-actions": g(u["section-actions"], { render: hr })(),
	comment: g(u.comment, { render: Kt })(),
	finding: g(u.finding, { render: dn })(),
	kpi: g(u.kpi, U)(),
	prototype: g(u.prototype, U)(),
	mockup: g(u.mockup, { render: hn })(),
	question: g(u.question, { render: Nn })(),
	answer: g(u.answer, U)()
}, W = Pe.create({ blockSpecs: {
	...He,
	...Dr
} });
//#endregion
//#region src/menu/section-context.ts
function Or(e, t) {
	let [n] = Ar(e, t);
	return n ? String(n.props.slot) : null;
}
function kr(e, t) {
	let n = Ar(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Ar(e, t) {
	let n = e.slice(0, jr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function jr(e, t) {
	return e.findIndex((e) => Mr(e, t));
}
function Mr(e, t) {
	return e.id === t || e.children.some((e) => Mr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", Nr = { cells: [
	"",
	"",
	""
] }, Pr = [
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
			rows: [Nr, Nr]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: f("kpi") })
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
		props: () => ({ questionId: f("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = kr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Fr(e, t) {
	return Pr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Ir(e, t));
}
function Ir(e, t) {
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
function Lr() {
	let e = _(W), t = o(I);
	return /* @__PURE__ */ m(Ae, {
		triggerCharacter: "/",
		getItems: async (n) => Ie(Rr(e, t), n)
	});
}
function Rr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && zr(t, i);
	return a ? Fr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Le(e, Ht(t))
	})) : [];
}
function zr(e, { blocks: t, cursorId: n }) {
	let r = Or(t, n);
	return r === null ? void 0 : d(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Br(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		...Vr(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function Vr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ue(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Hr(e) {
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
}, Ur = [], Wr = /* @__PURE__ */ new Map();
function Gr({ approval: e = null, children: t, ...n }) {
	return /* @__PURE__ */ h("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ m("p", {
				className: q.phase,
				children: e ? qr(e) : Kr(n.report)
			}),
			/* @__PURE__ */ m(Yr, { ...n }),
			t && /* @__PURE__ */ m("div", {
				className: q.footer,
				children: t
			})
		]
	});
}
function Kr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function qr({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Jr(t)}`;
}
function Jr(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Yr(e) {
	return /* @__PURE__ */ m("ol", {
		className: q.slots,
		children: Xr(e).map((e) => /* @__PURE__ */ m(Zr, { ...e }, e.section.slot))
	});
}
function Xr({ template: e, report: t, sections: n = Ur, droppedSlots: r, settled: i = Wr, onLocate: a }) {
	let o = Hr(t.problems);
	return Br(e, {
		sections: n,
		droppedSlots: r
	}, t.phase).map((e) => ({
		section: e,
		problems: o.get(e.slot) ?? [],
		settled: i.get(e.slot) ?? 0,
		onLocate: a
	}));
}
function Zr({ problems: e, settled: t, ...n }) {
	let { section: r } = n;
	return /* @__PURE__ */ h("li", {
		"aria-label": r.title,
		children: [
			/* @__PURE__ */ m(Qr, { ...n }),
			r.required && /* @__PURE__ */ m("span", {
				className: q.required,
				children: " required"
			}),
			t > 0 && /* @__PURE__ */ h("span", {
				className: q.settled,
				children: [" ", $r(t)]
			}),
			/* @__PURE__ */ m("ul", {
				className: q.problems,
				children: e.map((e) => /* @__PURE__ */ m("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
function Qr({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ m("span", {
		className: q.title,
		children: e.title
	}) : /* @__PURE__ */ m("button", {
		type: "button",
		className: q.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function $r(e) {
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
function ei(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(ti)) t.has(n.userId) || t.set(n.userId, ri(n.color, [...t.values()]));
	return t;
}
function ti(e, t) {
	return Number(ni(t)) - Number(ni(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function ni({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function ri(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function ii(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [ai(e, n)]);
}
function ai(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: li(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: ui(n),
		hasCursor: r != null
	};
}
function oi(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [si(e, t)] : []);
}
function si(e, t) {
	return {
		clientId: e,
		userId: li(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function ci(e, t) {
	let n = e.get(t)?.user, r = n && ei(oi(e)).get(li(t, n));
	return r === n?.color ? void 0 : r;
}
function li(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function ui(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function di(e, t, n) {
	let r = e.slot && d(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var fi = "⁠";
function pi(e) {
	let t = `background-color: var(${hi(e.id ?? "")}, ${e.color}); color: white`, n = _i("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = _i("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = _i("bn-collaboration-cursor__base");
	return i.append(fi, r, fi), i;
}
function mi(e, t) {
	t.forEach((t) => e.style.setProperty(hi(t.id), t.color));
}
function hi(e) {
	return `--ps-peer-${[...e].map(gi).join("")}`;
}
function gi(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function _i(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function vi(e) {
	let [t, n] = l(() => Z(e));
	return Si(e, () => n(Z(e))), t;
}
function yi(e, t) {
	Ci(e, t), bi(t), xi(e, t);
}
function bi(e) {
	Si(e, () => {
		let t = ci(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function xi(e, t) {
	Si(t, () => {
		let n = e.domElement;
		n && mi(n, Z(t));
	});
}
function Si(e, t) {
	let n = te(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function Ci(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: Or(r, n.id) });
	}), [e, t]);
}
function Z(e) {
	return ii(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function wi({ awareness: e, ...t }) {
	let n = vi(e);
	return n.length === 0 ? null : /* @__PURE__ */ m("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ m(Ti, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function Ti({ user: e, template: t, titles: n, onLocate: r }) {
	let i = di(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ m("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: Ei,
		onClick: () => r(e),
		children: /* @__PURE__ */ m(Di, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ m("span", {
		className: Y.away,
		children: /* @__PURE__ */ m(Di, {
			color: e.color,
			label: i
		})
	});
}
function Ei(e) {
	e.preventDefault();
}
function Di({ color: e, label: t }) {
	return /* @__PURE__ */ h(p, { children: [/* @__PURE__ */ m("svg", {
		className: Y.dot,
		viewBox: "0 0 2 2",
		"aria-hidden": "true",
		children: /* @__PURE__ */ m("circle", {
			cx: "1",
			cy: "1",
			r: "1",
			fill: e
		})
	}), t] });
}
//#endregion
//#region src/presence/scroll-to-cursor.ts
function Oi(e, t) {
	let n = e.prosemirrorView, r = ki(n, t);
	r !== null && Ai(n, r)?.scrollIntoView({ block: "center" });
}
function ki(e, t) {
	let [n] = Be.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Ai(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var ji = { notice: "_notice_1xdcv_1" }, Mi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Ni({ status: e, reason: t }) {
	return /* @__PURE__ */ h("p", {
		className: ji.notice,
		role: "status",
		"data-status": e,
		children: [Mi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Pi(e, t) {
	let n = Gi(e, t);
	return c(() => Fi(e), [e, n]);
}
function Fi(e) {
	let t = new Set(tt(e).map((e) => e.changeId)), n = Kn(e);
	return Ye(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: Li(n, r),
		write: () => t.has(r.changeId) ? Ge(e, r.changeId) : Ue(e, r.changeId),
		discard: () => Xe(e, r.changeId)
	}));
}
var Ii = {
	"remove-block": Ri,
	"set-section-text": zi,
	"set-section-prose": zi
};
function Li(e, t) {
	let n = Ii[t.op.op];
	return n && oe(t).length === 0 ? n(e, t) : void 0;
}
function Ri(e, t) {
	let n = e.flatMap(Vi).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: Ui(n)
	};
}
function zi(e, { op: t, slot: n }) {
	let r = new Set(Bi(ae(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Bi(e, n).filter((e) => !r.has(e.id)).flatMap(Ui)
	};
}
function Bi(e, t) {
	return pe(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Vi(e) {
	return [e, ...Hi(e).flatMap(Vi)];
}
function Hi(e) {
	return ce(e) ? [] : e.children;
}
function Ui(e) {
	return [Wi(e.content), ...Hi(e).flatMap(Ui)].filter(Boolean);
}
function Wi(e) {
	return Array.isArray(e) ? me(e) : ye(e).flat().map(me).join(" · ");
}
function Gi(e, t) {
	let [n, r] = l(0), i = te(t);
	return i.current = t, s(() => {
		let t = () => {
			r((e) => e + 1), i.current?.();
		};
		return e.on("update", t), t(), () => e.off("update", t);
	}, [e]), n;
}
//#endregion
//#region src/session/plan-session.ts
var Q = "plan-transport", Ki = class extends nt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function qi(e) {
	let t = new it(), n = {
		doc: t,
		awareness: new Ki(t)
	}, r = Yi({
		status: "connecting",
		meta: null
	});
	Qi(n, e);
	let i = e.subscribe((e) => Zi({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Ji(n, i)
	};
}
function Ji({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Yi(e) {
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
var Xi = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		x(e, v(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => x(e, v(t), Q),
	awareness: ({ awareness: e }, { update: t }) => rt(e, v(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Zi(e, t) {
	Xi[t.type](e, t);
}
function Qi({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: y(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = b(n, e(t));
		r.send({
			type: "awareness",
			update: y(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function $i(e) {
	let [t, n] = l(null);
	return s(() => {
		let t = qi(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function ea(e) {
	return ne(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var ta = new ze("planChangeWidgets");
function na(e, t) {
	return Fe({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new Re({
			key: ta,
			props: { decorations: (n) => ct.create(n.doc, ra(n, e, t)) }
		})]
	});
}
function ra(e, t, n) {
	let r = sa(e);
	return Ye(t).flatMap((e) => {
		let t = ia(r, e);
		return t === void 0 ? [] : [aa(t, e, n)];
	});
}
function ia(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function aa(e, t, n) {
	return st.widget(e, () => oa(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function oa(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function sa(e) {
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
function ca({ session: e, meta: t, user: n, onChange: r }) {
	let i = c(() => /* @__PURE__ */ new Map(), []), o = la(e, n, i), s = ua(o, e, a((e) => r?.(T(e, t)), [t, r]));
	return {
		editor: o,
		plan: c(() => T(s, t), [s, t]),
		hosts: i
	};
}
function la(e, t, n) {
	let { doc: r } = e;
	return je(ot({
		schema: W,
		extensions: [wt, na(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(ie),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: pi
		}
	}), [e]);
}
function ua(e, t, n) {
	let [r, i] = l(() => et(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var da = {};
function fa({ transport: e, adapters: t = da, className: n, ...r }) {
	let i = $i(e), a = pa(r);
	return /* @__PURE__ */ m(lt, {
		value: t,
		children: /* @__PURE__ */ m("div", {
			className: ma({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ m(ha, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ m(Ni, { status: "connecting" })
		})
	});
}
function pa({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function ma({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ha({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = ea(t.session);
	if (!r) return /* @__PURE__ */ m(Ni, {
		status: n,
		reason: i
	});
	let a = e ?? be(r.type);
	return /* @__PURE__ */ h(I, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ m(Ni, {
			status: n,
			reason: i
		}), /* @__PURE__ */ m(ga, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ga({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: ee } = ca(r), c = _a(i, o, ee), te = Ea(s, e, t);
	return yi(o, i.awareness), /* @__PURE__ */ m(ut, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ m(va, {
			...r,
			...c,
			...s,
			report: te
		})
	});
}
function _a(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function va(e) {
	let t = ba(e.sections);
	return /* @__PURE__ */ h(Gn, {
		value: t,
		children: [/* @__PURE__ */ m(Ta, { ...e }), /* @__PURE__ */ m(ya, {
			...e,
			titles: t
		})]
	});
}
function ya({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ h("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ m(xa, { ...n }), t && /* @__PURE__ */ m(Sa, { ...n })]
	});
}
function ba(e) {
	return c(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function xa({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ m(wi, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => Oi(e, t.clientId)
	});
}
function Sa({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = wa(r.sections);
	return /* @__PURE__ */ m(Gr, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => Ca(e, t),
		children: n
	});
}
function Ca(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function wa(e) {
	return c(() => _e(xe({ sections: e }), e.map((e) => e.slot)), [e]);
}
function Ta({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Pi(n, () => Da(e));
	return /* @__PURE__ */ h(re, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ m(Lr, {}),
			/* @__PURE__ */ m(Ft, {}),
			/* @__PURE__ */ m(dt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Ea(e, t, n) {
	let r = c(() => we(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Da(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function Oa(e) {
	let t = Qe(e.blocks), n = new nt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Aa(r), {
		doc: t,
		connect: () => Ma(r)
	};
}
function ka(e) {
	return Oa(e).connect();
}
function Aa(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => ja(t, n, {
		type: "update",
		update: y(e)
	})), r.on("update", (n, i) => {
		let a = b(r, e(n));
		ja(t, i, {
			type: "awareness",
			update: y(a)
		});
	});
}
function ja(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Ma(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Na(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Pa(e, n), () => t.handlers.delete(n))
	};
}
function Na(e, t, n) {
	if (n.type === "update") {
		x(e.doc, v(n.update), t);
		return;
	}
	rt(e.awareness, v(n.update), t);
}
function Pa({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: y(at(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = b(t, i);
		r({
			type: "awareness",
			update: y(e)
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
}, Fa = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Ia({ before: e, after: t, className: n }) {
	let r = se(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ h("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ m("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ m(La, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ m(Ra, { section: e }, e.slot)),
			/* @__PURE__ */ m(za, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function La({ changes: e }) {
	return /* @__PURE__ */ m("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ h("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function Ra({ section: e }) {
	return /* @__PURE__ */ h("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ m("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ m("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ h("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					children: [Fa[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function za({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ h("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ m("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ m("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ h("li", {
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
export { Ia as PlanDiffView, fa as PlanEditor, Tt as bypassTemplate, Oa as createMemoryHub, Ut as fromEditorBlocks, ka as localTransport, W as planSchema, T as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map