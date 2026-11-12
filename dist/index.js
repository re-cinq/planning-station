import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as ee, useMemo as c, useRef as l, useState as u, useSyncExternalStore as te } from "react";
import { BlockNoteView as ne } from "@blocknote/ariakit";
import { MARGIN_NOTES as d, NOT_CONTENT as re, PLAN_BLOCK_CONFIGS as f, PLAN_FRAGMENT as ie, SECTION_ACTIONS as p, applyOps as ae, changeWords as oe, diffPlans as se, findSectionSlot as ce, isPlanBlock as le, isRemovableSlot as ue, isRequiredAt as de, newId as m, optionsOf as fe, parseBlock as pe, partitionSections as me, plainText as he, previewProposal as ge, refineInputs as _e, settledBySlot as ve, settledCount as ye, tableCells as be, templateFor as xe, toBlocks as Se, toPlanDocument as Ce, usesOf as we, validatePlan as Te } from "@re-cinq/planning-document";
import { createPortal as Ee } from "react-dom";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
import { offset as De } from "@floating-ui/react";
import { SideMenuExtension as Oe } from "@blocknote/core/extensions";
import { SideMenu as ke, SideMenuController as Ae, SuggestionMenuController as je, createReactBlockSpec as v, useBlockNoteEditor as y, useCreateBlockNote as Me, useEditorChange as Ne, useExtensionState as Pe } from "@blocknote/react";
import { BlockNoteSchema as Fe, createExtension as b, filterSuggestionItems as Ie, insertOrUpdateBlockForSlashMenu as Le } from "@blocknote/core";
import { NodeSelection as x, Plugin as S, PluginKey as Re, TextSelection as ze } from "prosemirror-state";
import { yCursorPluginKey as Be, ySyncPluginKey as Ve } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as He, acceptChange as Ue, acceptRefine as We, applyChangeAnyway as Ge, applyOpsToDoc as Ke, applyRefineAnyway as qe, askRefine as Je, changesIn as Ye, discardChange as Xe, discardRefine as Ze, docFromBlocks as Qe, fromBase64 as C, proposalsIn as $e, readBlocks as et, staleChanges as tt, toBase64 as w } from "@re-cinq/planning-yjs";
import { Awareness as nt, applyAwarenessUpdate as rt, encodeAwarenessUpdate as it } from "y-protocols/awareness";
import { Doc as at, applyUpdate as ot, encodeStateAsUpdate as st } from "yjs";
import { withCollaboration as ct } from "@blocknote/core/yjs";
import { Decoration as T, DecorationSet as E } from "prosemirror-view";
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
	return /* @__PURE__ */ g(h, { children: e.map((e) => /* @__PURE__ */ g(ft, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function ft({ review: e, host: t }) {
	return t ? Ee(/* @__PURE__ */ g(pt, { review: e }), t) : null;
}
function pt({ review: e }) {
	return /* @__PURE__ */ _("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: O.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g(gt, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ g(mt, {}),
			/* @__PURE__ */ g(ht, { review: e })
		]
	});
}
function mt() {
	return /* @__PURE__ */ g("p", {
		className: O.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function ht({ review: e }) {
	return /* @__PURE__ */ _("p", {
		className: O.bar,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: k.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ g("button", {
			type: "button",
			className: k.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function gt({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ g(_t, { removal: t }) : oe(e).map((e, t) => /* @__PURE__ */ g("p", {
		className: O.words,
		children: e
	}, t));
}
function _t({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : yt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ g("p", {
		className: O.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("p", {
		className: O.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ g("p", {
		className: O.dropped,
		children: /* @__PURE__ */ g("del", { children: e })
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
var bt = "planTemplateBypass", A = "section-heading", xt = "blockContent", j = [
	"plan-title",
	A,
	"section-panel",
	p
], St = b({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new S({ filterTransaction: wt })]
});
function Ct(e, t) {
	return e.setMeta(bt, t);
}
function wt(e, t) {
	if (!e.docChanged || Tt(e)) return !0;
	let n = Et(t.doc), r = Et(e.doc);
	return Ft(Ot(n), Ot(r)) && kt(n, r) && jt(n, r);
}
function Tt(e) {
	let t = e.getMeta(Ve);
	return !!e.getMeta(bt) || t?.isChangeOrigin === !0;
}
function Et(e) {
	let t = [];
	return e.descendants((e) => {
		Dt(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Dt(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(xt);
}
function Ot(e) {
	return e.filter((e) => j.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function kt(e, t) {
	return At(t) === 0 || At(e) > 0;
}
function At(e) {
	let t = e.findIndex((e) => e.type === A);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function jt(e, t) {
	let n = Nt(e);
	return [...Nt(t)].every(([e, t]) => t <= (n.get(e) ?? 0));
}
var Mt = [...d, "answer"];
function Nt(e) {
	let t = /* @__PURE__ */ new Map();
	return e.reduce((e, n) => n.type === A ? {
		slot: n.slot,
		closed: !1
	} : (e.closed && !Mt.includes(n.type) && t.set(e.slot, (t.get(e.slot) ?? 0) + 1), {
		slot: e.slot,
		closed: e.closed || Pt(n)
	}), {
		slot: "",
		closed: !1
	}), t;
}
function Pt(e) {
	return e.type === p;
}
function Ft(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var It = { useFloatingOptions: {
	placement: "left-start",
	middleware: [De(({ elements: e, rects: t }) => {
		let n = zt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Lt() {
	return /* @__PURE__ */ g(Ae, {
		floatingUIOptions: It,
		sideMenu: Rt
	});
}
function Rt() {
	let e = Pe(Oe, { selector: (e) => e?.block.type });
	return e === void 0 || j.includes(e) ? null : /* @__PURE__ */ g(ke, {});
}
function zt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Bt(t) : null;
}
function Bt(e) {
	let t = Vt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Vt(e) {
	let t = Ht(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Ut(n);
}
function Ht(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Ut(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Wt(e) {
	return e;
}
function Gt(e) {
	return e.map(pe);
}
function Kt(e, t) {
	return Ce(Gt(e), t);
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
	let r = !!e.props.replyTo, i = ln(P(e));
	return /* @__PURE__ */ _("aside", {
		className: M.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${F(e)}`,
		...Zt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ g(Qt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ g("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(Xt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Xt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: M.actions,
		contentEditable: !1,
		children: [fn(e) && /* @__PURE__ */ g($t, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ g(en, {
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
	return /* @__PURE__ */ _("p", {
		className: M.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("span", {
				className: M.author,
				children: F(e)
			}),
			/* @__PURE__ */ g("time", {
				className: M.when,
				children: mn(e.props.at)
			}),
			t && /* @__PURE__ */ g("span", {
				className: M.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function $t({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ g(N, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Jt)
	}) : /* @__PURE__ */ g(an, {
		block: e,
		editor: t
	});
}
function en({ block: e, editor: t }) {
	let [n, r] = u(!1), i = rn(e);
	return /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g(N, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ g(tn, {
		question: nn(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function tn({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ _("div", {
		className: M.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("p", {
				className: M.question,
				children: e
			}),
			/* @__PURE__ */ g(N, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ g(N, {
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
	let t = y();
	if (!fn(e)) return [e];
	let n = P(e);
	return t.document.filter((e) => e.type === "comment" && P(e) === n);
}
function an({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ _(h, { children: [n ? /* @__PURE__ */ g(on, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ g(N, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ g(N, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, qt)
	})] });
}
function N({ label: e, onClick: t }) {
	return /* @__PURE__ */ g("button", {
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
	return /* @__PURE__ */ g("form", {
		className: M.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ g(sn, {
			to: F(e),
			draft: r,
			onDraft: i
		})
	});
}
function sn({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ g("input", {
		className: M.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function cn({ editor: e, block: t }) {
	let { user: n } = D(), r = y();
	return (i) => {
		if (!i) return;
		let a = P(t), o = r.document, s = dn(o, a) ?? t;
		e.insertBlocks([pn(a, i, n.name)], s, "after");
	};
}
function ln(e) {
	let t = y(), n = () => un(t.document, e), [r, i] = u(n);
	return Ne(() => i(n())), r;
}
function un(e, t) {
	return e.some((e) => fn(e) && P(e) === t && e.props.resolved === !0);
}
function dn(e, t) {
	return e.filter((e) => e.type === "comment" && P(e) === t).at(-1);
}
function fn(e) {
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
			commentId: m("cmt"),
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
	finding: "_finding_d6sjh_1",
	who: "_who_d6sjh_24",
	label: "_label_d6sjh_37",
	why: "_why_d6sjh_41",
	text: "_text_d6sjh_45",
	actions: "_actions_d6sjh_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function hn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ _("aside", {
		className: I.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": vn(r),
		children: [
			/* @__PURE__ */ g(gn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ g("div", {
				className: I.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(_n, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function gn({ severity: e, why: t }) {
	return /* @__PURE__ */ _("p", {
		className: I.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("span", {
			className: I.label,
			children: vn(e)
		}), t && /* @__PURE__ */ g("span", {
			className: I.why,
			children: t
		})]
	});
}
function _n({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: I.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ g("button", {
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
	let { renderMockup: t } = o(lt);
	return /* @__PURE__ */ _("figure", {
		className: L.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ _("figcaption", {
			className: L.label,
			children: [
				"Mockup (",
				e.props.format,
				")"
			]
		}), t ? t(e.props) : /* @__PURE__ */ g("p", { children: "The host renders mockups; none is configured." })]
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
	let i = ee(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: R.steps,
		disabled: r
	};
	return /* @__PURE__ */ _("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ g("legend", {
			className: R.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ g(Cn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function Cn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ _("label", {
		className: R.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ g("input", {
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
	let n = ee();
	return /* @__PURE__ */ _("span", {
		className: z.field,
		"data-field": e,
		children: [/* @__PURE__ */ g("label", {
			className: z.label,
			htmlFor: n,
			children: Tn(wn, e)
		}), /* @__PURE__ */ g(Dn, {
			...t,
			id: n
		})]
	});
}
function Dn(e) {
	return e.spec.values ? /* @__PURE__ */ g(On, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ g(kn, { ...e });
}
function On({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ g("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ g("option", { children: e }, e))
	});
}
function kn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ g("input", {
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
	return /* @__PURE__ */ _("div", {
		className: L.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ g(Mn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ g("div", {
			className: L.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function Mn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ _("div", {
		className: L.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("p", {
			className: L.head,
			children: [/* @__PURE__ */ g("span", {
				className: L.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ g(Nn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ g(Pn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Nn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ _("a", {
		className: L.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ g("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function Pn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = f[e.type], o = a;
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
	return /* @__PURE__ */ g("h1", {
		className: Fn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var B = {
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
function Ln({ block: e, editor: t, contentRef: n }) {
	let r = fe(e.props.options);
	return /* @__PURE__ */ _("div", {
		className: B.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ g(Rn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ g("div", {
				className: B.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ g(zn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Rn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ g("p", {
		className: B.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ g("span", {
			className: B.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ _("p", {
		className: B.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("span", {
				className: B.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ g("span", {
				className: B.why,
				children: e
			}),
			/* @__PURE__ */ g("span", {
				className: B.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function zn({ block: e, editor: t, options: n }) {
	return Gn(qn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ g(Bn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ g(Hn, {
		block: e,
		editor: t
	});
}
function Bn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ g("ul", {
		className: B.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(Vn, {
			onPick: () => Wn(t, e, n),
			children: n
		}) }, n))
	});
}
function Vn({ onPick: e, children: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: B.suggestion,
		onClick: e,
		children: t
	});
}
function Hn({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ _("form", {
		className: B.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Wn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ g(Un, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ g("button", {
			type: "submit",
			className: B.answerButton,
			children: "Answer"
		})]
	});
}
function Un({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ g("input", {
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
	let t = y(), [n, r] = u(() => Kn(t.document, e));
	return Ne(() => r(Kn(t.document, e))), n;
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
	Ke(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var V = n(null), Yn = n(/* @__PURE__ */ new Map());
function Xn(e) {
	let t = o(V), n = o(Yn).get(e);
	return t ? ce(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var H = /* @__PURE__ */ new WeakMap();
function Zn(e) {
	let t = H.get(e);
	if (t) return t;
	let n = et(e);
	return H.set(e, n), e.once("update", () => H.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function Qn(e, t) {
	let n = tr(e);
	return c(() => {
		let n = Zn(e), r = _e(n, t), i = $e(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ye(r),
			proposal: a,
			busyFor: $n(i, t),
			preview: a?.status === "proposed" ? ge(n, a) : void 0,
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
	return t.proposal ? /* @__PURE__ */ g(rr, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ g(or, { ...a });
}
function rr({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ g(lr, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ g(ur, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ g(dr, {
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
	return /* @__PURE__ */ _(h, { children: [n && /* @__PURE__ */ g(sr, { reason: n }), /* @__PURE__ */ _("p", {
		className: k.bar,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: k.refine,
			disabled: !r,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ g("span", {
			className: k.note,
			children: cr(e)
		})]
	})] });
}
function sr({ reason: e }) {
	return /* @__PURE__ */ _("p", {
		className: k.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function cr(e) {
	return e.busyFor === void 0 ? e.settled > 0 ? `uses ${vr(e)}` : "Answer a question or resolve a thread to refine" : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function lr({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ _("p", {
		className: k.bar,
		role: "status",
		children: [/* @__PURE__ */ _("span", {
			className: k.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ g("button", {
			type: "button",
			className: k.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function ur({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ _("section", {
		className: k.proposal,
		children: [/* @__PURE__ */ _("p", {
			className: k.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ _("p", {
			className: k.bar,
			children: [
				/* @__PURE__ */ g(mr, {
					label: "Ask again",
					run: t,
					disabled: e.busyFor !== void 0
				}),
				/* @__PURE__ */ g(hr, {
					label: "Dismiss",
					run: e.discard
				}),
				/* @__PURE__ */ g(pr, { refine: e })
			]
		})]
	});
}
function dr({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ _("section", {
		className: k.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ _("p", {
				className: k.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					yr(r)
				]
			}),
			/* @__PURE__ */ g(gr, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ _("p", {
				className: k.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ g(fr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function fr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ _("p", {
		className: k.bar,
		children: [
			/* @__PURE__ */ g(mr, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ g(hr, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ g(hr, {
				label: "Discard",
				run: e.discard
			}),
			n && /* @__PURE__ */ g(pr, { refine: e })
		]
	});
}
function pr({ refine: e }) {
	return e.busyFor !== void 0 && /* @__PURE__ */ _("span", {
		className: k.note,
		children: [
			"The agent is refining another section for ",
			e.busyFor,
			"; ask again when it finishes"
		]
	});
}
function mr({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: k.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function hr({ label: e, run: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: k.quiet,
		onClick: t,
		children: e
	});
}
function gr({ lines: e }) {
	return /* @__PURE__ */ g("ul", {
		className: k.lines,
		children: e.map((e, t) => /* @__PURE__ */ g("li", {
			className: k[e.kind],
			children: /* @__PURE__ */ g(_r, { line: e })
		}, `${t}-${e.text}`))
	});
}
function _r({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ g("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ g("del", { children: e.text }) : e.text;
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
	return !a || !t.isEditable ? null : /* @__PURE__ */ _("div", {
		role: "group",
		className: U.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [i && /* @__PURE__ */ g(nr, {
			doc: a,
			slot: n,
			title: r
		}), /* @__PURE__ */ g(Cr, {
			doc: a,
			slot: n,
			title: r
		})]
	});
}
function Cr({ doc: e, slot: t, title: n }) {
	let r = o(V), [i, a] = u(!1);
	return !r || !ue(r, t) ? null : /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g(wr, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ g(Tr, {
		title: n,
		onConfirm: () => Jn(e, t),
		onCancel: () => a(!1)
	})] });
}
function wr({ title: e, onClick: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: U.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ g(Er, {})
	});
}
function Tr({ title: e, onConfirm: t, onCancel: n }) {
	let r = `Remove ${e}?`;
	return /* @__PURE__ */ _("div", {
		className: U.confirm,
		role: "dialog",
		"aria-label": r,
		children: [
			/* @__PURE__ */ _("p", {
				className: U.question,
				children: [r, " Its content, comments and questions are deleted."]
			}),
			/* @__PURE__ */ g("button", {
				type: "button",
				onClick: n,
				children: "Cancel"
			}),
			/* @__PURE__ */ g("button", {
				type: "button",
				onClick: t,
				children: "Remove"
			})
		]
	});
}
function Er() {
	return /* @__PURE__ */ g("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ g("path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" })
	});
}
function Dr(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: Xn(t)?.title ?? t
	};
}
var Or = {
	composer: "_composer_1b5ds_1",
	input: "_input_1b5ds_8",
	send: "_send_1b5ds_25"
};
//#endregion
//#region src/blocks/CommentComposer.tsx
function kr(e) {
	let { draft: t, setDraft: n, say: r } = Ar(e), { title: i } = e.block.props;
	return /* @__PURE__ */ _("form", {
		className: Or.composer,
		onSubmit: r,
		children: [/* @__PURE__ */ g(jr, {
			title: i,
			draft: t,
			onDraft: n,
			onLeave: e.onDone
		}), /* @__PURE__ */ g("button", {
			type: "submit",
			className: Or.send,
			children: "Comment"
		})]
	});
}
function Ar({ block: e, editor: t, onDone: n }) {
	let { user: r } = D(), [i, a] = u("");
	return {
		draft: i,
		setDraft: a,
		say: (a) => {
			let o = i.trim();
			a.preventDefault(), o && (t.insertBlocks([Mr(o, r.name)], e, "after"), n());
		}
	};
}
function jr({ title: e, draft: t, onDraft: n, onLeave: r }) {
	return /* @__PURE__ */ g("input", {
		className: Or.input,
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
function Mr(e, t) {
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
var W = {
	heading: "_heading_hnkiw_1",
	row: "_row_hnkiw_9",
	comment: "_comment_hnkiw_16",
	title: "_title_hnkiw_35",
	hint: "_hint_hnkiw_43"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function Nr({ block: e, editor: t }) {
	let [n, r] = u(!1), { slot: i, title: a } = e.props;
	return /* @__PURE__ */ _("header", {
		className: W.heading,
		"data-slot": i,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g(Fr, {
				title: a,
				commentable: t.isEditable,
				open: n,
				onToggle: () => r(!n)
			}),
			/* @__PURE__ */ g(Pr, { slot: i }),
			n && /* @__PURE__ */ g(kr, {
				block: e,
				editor: t,
				onDone: () => r(!1)
			})
		]
	});
}
function Pr({ slot: e }) {
	let t = Xn(e)?.hint;
	return t && /* @__PURE__ */ g("p", {
		className: W.hint,
		children: t
	});
}
function Fr({ title: e, commentable: t, open: n, onToggle: r }) {
	return /* @__PURE__ */ _("div", {
		className: W.row,
		children: [/* @__PURE__ */ g("h2", {
			className: W.title,
			children: e
		}), t && /* @__PURE__ */ g(Ir, {
			title: e,
			open: n,
			onToggle: r
		})]
	});
}
function Ir({ title: e, open: t, onToggle: n }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: W.comment,
		"aria-expanded": t,
		"aria-label": `${t ? "Close comment" : "Comment"} on ${e}`,
		onMouseDown: (e) => e.preventDefault(),
		onClick: n,
		children: "Comment"
	});
}
//#endregion
//#region src/blocks/SectionPanel.tsx
function Lr() {
	return null;
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var Rr = { render: jn }, zr = {
	"plan-title": v(f["plan-title"], { render: In })(),
	"section-heading": v(f["section-heading"], { render: Nr })(),
	"section-panel": v(f["section-panel"], { render: Lr })(),
	"section-actions": v(f["section-actions"], { render: Sr })(),
	comment: v(f.comment, { render: Yt })(),
	finding: v(f.finding, { render: hn })(),
	kpi: v(f.kpi, Rr)(),
	prototype: v(f.prototype, Rr)(),
	mockup: v(f.mockup, { render: yn })(),
	question: v(f.question, { render: Ln })(),
	answer: v(f.answer, Rr)()
}, Br = Fe.create({ blockSpecs: {
	...He,
	...zr
} });
//#endregion
//#region src/menu/section-context.ts
function Vr(e, t) {
	let [n] = Ur(e, t);
	return n ? String(n.props.slot) : null;
}
function Hr(e, t) {
	let n = Ur(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Ur(e, t) {
	let n = e.slice(0, Wr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Wr(e, t) {
	return e.findIndex((e) => Gr(e, t));
}
function Gr(e, t) {
	return e.id === t || e.children.some((e) => Gr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", Kr = { cells: [
	"",
	"",
	""
] }, qr = [
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
			rows: [Kr, Kr]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: m("kpi") })
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
		props: () => ({ questionId: m("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = Hr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Jr(e, t) {
	return qr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Yr(e, t));
}
function Yr(e, t) {
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
function Xr() {
	let e = y(Br), t = o(V);
	return /* @__PURE__ */ g(je, {
		triggerCharacter: "/",
		getItems: async (n) => Ie(Zr(e, t), n)
	});
}
function Zr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && Qr(t, i);
	return a ? Jr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Le(e, Wt(t))
	})) : [];
}
function Qr(e, { blocks: t, cursorId: n }) {
	let r = Vr(t, n);
	return r === null ? void 0 : ce(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function $r(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		...ei(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function ei(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && de(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function ti(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
//#endregion
//#region src/outline/section-state.ts
function ni(e, t) {
	return t.length > 0 ? "problem" : e.inPlan ? "ready" : "missing";
}
function ri(e) {
	let t = e.filter(({ section: e }) => e.required);
	return {
		ready: t.filter(({ section: e, problems: t }) => ni(e, t) === "ready").length,
		total: t.length
	};
}
var q = {
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
}, ii = [], ai = /* @__PURE__ */ new Map();
function oi({ approval: e = null, children: t, ...n }) {
	let r = fi(n);
	return /* @__PURE__ */ _("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ g("p", {
				className: q.phase,
				children: ci(e, n.report)
			}),
			!e && /* @__PURE__ */ g(si, { ...ri(r) }),
			/* @__PURE__ */ g("ol", {
				className: q.slots,
				children: r.map((e) => /* @__PURE__ */ g(hi, { ...e }, e.section.slot))
			}),
			t && /* @__PURE__ */ g("div", {
				className: q.footer,
				children: t
			})
		]
	});
}
function si({ ready: e, total: t }) {
	return t === 0 ? null : /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ _("p", {
		className: q.progress,
		children: [
			e,
			" of ",
			t,
			" required sections ready"
		]
	}), /* @__PURE__ */ g("progress", {
		className: q.bar,
		"aria-label": "Required sections ready",
		value: e,
		max: t
	})] });
}
function ci(e, t) {
	return e ? ui(e) : li(t);
}
function li(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function ui({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${di(t)}`;
}
function di(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function fi({ template: e, report: t, sections: n = ii, droppedSlots: r, settled: i = ai, onLocate: a }) {
	let o = ti(t.problems);
	return $r(e, {
		sections: n,
		droppedSlots: r
	}, t.phase).map((e) => ({
		section: e,
		problems: o.get(e.slot) ?? [],
		settled: i.get(e.slot) ?? 0,
		onLocate: a
	}));
}
var pi = {
	ready: "ready",
	problem: "needs work",
	missing: "not in the plan"
}, mi = {
	ready: "✓",
	problem: "!",
	missing: ""
};
function hi({ problems: e, settled: t, ...n }) {
	let { section: r } = n, i = ni(r, e);
	return /* @__PURE__ */ _("li", {
		className: q.slot,
		"aria-label": `${r.title}, ${pi[i]}`,
		children: [
			/* @__PURE__ */ g(gi, { state: i }),
			/* @__PURE__ */ g(vi, { ...n }),
			r.required && /* @__PURE__ */ g("span", {
				className: q.required,
				children: "required"
			}),
			/* @__PURE__ */ g(_i, {
				problems: e,
				settled: t
			})
		]
	});
}
function gi({ state: e }) {
	return /* @__PURE__ */ g("span", {
		className: q.mark,
		"aria-hidden": "true",
		"data-state": e,
		children: mi[e]
	});
}
function _i({ problems: e, settled: t }) {
	return /* @__PURE__ */ _(h, { children: [t > 0 && /* @__PURE__ */ g("span", {
		className: q.settled,
		children: yi(t)
	}), /* @__PURE__ */ g("ul", {
		className: q.problems,
		children: e.map((e) => /* @__PURE__ */ g("li", { children: e.message }, `${e.code}-${e.message}`))
	})] });
}
function vi({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ g("span", {
		className: q.title,
		children: e.title
	}) : /* @__PURE__ */ g("button", {
		type: "button",
		className: q.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function yi(e) {
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
function bi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(xi)) t.has(n.userId) || t.set(n.userId, Ci(n.color, [...t.values()]));
	return t;
}
function xi(e, t) {
	return Number(Si(t)) - Number(Si(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Si({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function Ci(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function wi(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Ti(e, n)]);
}
function Ti(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: ki(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: Ai(n),
		hasCursor: r != null
	};
}
function Ei(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Di(e, t)] : []);
}
function Di(e, t) {
	return {
		clientId: e,
		userId: ki(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Oi(e, t) {
	let n = e.get(t)?.user, r = n && bi(Ei(e)).get(ki(t, n));
	return r === n?.color ? void 0 : r;
}
function ki(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Ai(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function ji(e, t, n) {
	let r = e.slot && ce(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Mi = "⁠";
function Ni(e) {
	let t = `background-color: var(${Fi(e.id ?? "")}, ${e.color}); color: white`, n = Z("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Z("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Z("bn-collaboration-cursor__base");
	return i.append(Mi, r, Mi), i;
}
function Pi(e, t) {
	t.forEach((t) => e.style.setProperty(Fi(t.id), t.color));
}
function Fi(e) {
	return `--ps-peer-${[...e].map(Ii).join("")}`;
}
function Ii(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Z(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function Li(e) {
	let [t, n] = u(() => Ui(e));
	return Vi(e, () => n(Ui(e))), t;
}
function Ri(e, t) {
	Hi(e, t), zi(t), Bi(e, t);
}
function zi(e) {
	Vi(e, () => {
		let t = Oi(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function Bi(e, t) {
	Vi(t, () => {
		let n = e.domElement;
		n && Pi(n, Ui(t));
	});
}
function Vi(e, t) {
	let n = l(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function Hi(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: Vr(r, n.id) });
	}), [e, t]);
}
function Ui(e) {
	return wi(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function Wi({ awareness: e, ...t }) {
	let n = Li(e);
	return n.length === 0 ? null : /* @__PURE__ */ g("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(Gi, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function Gi({ user: e, template: t, titles: n, onLocate: r }) {
	let i = ji(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ g("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: Ki,
		onClick: () => r(e),
		children: /* @__PURE__ */ g(qi, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ g("span", {
		className: Y.away,
		children: /* @__PURE__ */ g(qi, {
			color: e.color,
			label: i
		})
	});
}
function Ki(e) {
	e.preventDefault();
}
function qi({ color: e, label: t }) {
	return /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("svg", {
		className: Y.dot,
		viewBox: "0 0 2 2",
		"aria-hidden": "true",
		children: /* @__PURE__ */ g("circle", {
			cx: "1",
			cy: "1",
			r: "1",
			fill: e
		})
	}), t] });
}
//#endregion
//#region src/presence/scroll-to-cursor.ts
function Ji(e, t) {
	let n = e.prosemirrorView, r = Yi(n, t);
	r !== null && Xi(n, r)?.scrollIntoView({ block: "center" });
}
function Yi(e, t) {
	let [n] = Be.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Xi(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Zi = { notice: "_notice_1xdcv_1" }, Qi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function $i({ status: e, reason: t }) {
	return /* @__PURE__ */ _("p", {
		className: Zi.notice,
		role: "status",
		"data-status": e,
		children: [Qi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function ea(e, t) {
	let n = da(e, t);
	return c(() => ta(e), [e, n]);
}
function ta(e) {
	let t = new Set(tt(e).map((e) => e.changeId)), n = Zn(e);
	return Ye(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: ra(n, r),
		write: () => t.has(r.changeId) ? Ge(e, r.changeId) : Ue(e, r.changeId),
		discard: () => Xe(e, r.changeId)
	}));
}
var na = {
	"remove-block": ia,
	"set-section-text": aa,
	"set-section-prose": aa
};
function ra(e, t) {
	let n = na[t.op.op];
	return n && oe(t).length === 0 ? n(e, t) : void 0;
}
function ia(e, t) {
	let n = e.flatMap(sa).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: la(n)
	};
}
function aa(e, { op: t, slot: n }) {
	let r = new Set(oa(ae(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: oa(e, n).filter((e) => !r.has(e.id)).flatMap(la)
	};
}
function oa(e, t) {
	return me(e).find((e) => e.slot === t)?.blocks ?? [];
}
function sa(e) {
	return [e, ...ca(e).flatMap(sa)];
}
function ca(e) {
	return le(e) ? [] : e.children;
}
function la(e) {
	return [ua(e.content), ...ca(e).flatMap(la)].filter(Boolean);
}
function ua(e) {
	return Array.isArray(e) ? he(e) : be(e).flat().map(he).join(" · ");
}
function da(e, t) {
	let [n, r] = u(0), i = l(t);
	return i.current = t, s(() => {
		let t = () => {
			r((e) => e + 1), i.current?.();
		};
		return e.on("update", t), t(), () => e.off("update", t);
	}, [e]), n;
}
//#endregion
//#region src/session/plan-session.ts
var fa = "plan-transport", pa = class extends nt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function ma(e) {
	let t = new at(), n = {
		doc: t,
		awareness: new pa(t)
	}, r = ga({
		status: "connecting",
		meta: null
	});
	ya(n, e);
	let i = e.subscribe((e) => va({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => ha(n, i)
	};
}
function ha({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function ga(e) {
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
var _a = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		ot(e, C(n), fa), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => ot(e, C(t), fa),
	awareness: ({ awareness: e }, { update: t }) => rt(e, C(t), fa),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function va(e, t) {
	_a[t.type](e, t);
}
function ya({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: w(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = it(n, e(t));
		r.send({
			type: "awareness",
			update: w(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function ba(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = ma(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function xa(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Sa = new Re("planChangeWidgets");
function Ca(e, t) {
	return b({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new S({
			key: Sa,
			props: { decorations: (n) => E.create(n.doc, wa(n, e, t)) }
		})]
	});
}
function wa(e, t, n) {
	let r = Oa(e);
	return Ye(t).flatMap((e) => {
		let t = Ta(r, e);
		return t === void 0 ? [] : [Ea(t, e, n)];
	});
}
function Ta(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ea(e, t, n) {
	return T.widget(e, () => Da(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Da(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Oa(e) {
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
var ka = [
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"CapsLock"
];
function Aa(e) {
	let { dom: t } = e;
	t instanceof HTMLElement && t.blur();
}
function ja(e) {
	let { dom: t } = e, n = new AbortController(), { signal: r } = n, i = {
		capture: !0,
		signal: r
	}, { ownerDocument: a } = t;
	a.addEventListener("paste", Ma(t), i), a.addEventListener("pointerup", () => {
		setTimeout(() => n.abort());
	}, i), a.addEventListener("keydown", Na(n), i), a.defaultView?.addEventListener("blur", () => n.abort(), { signal: r });
}
function Ma(e) {
	return (t) => {
		t.target instanceof Node && e.contains(t.target) && (t.preventDefault(), t.stopPropagation());
	};
}
function Na(e) {
	return ({ key: t }) => {
		ka.includes(t) || e.abort();
	};
}
function Pa(e) {
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
var Fa = "Write here…", Ia = "paragraph", La = "ps-empty-section", Ra = [
	...re,
	"question",
	"answer"
], za = 0;
function Ba(e, t) {
	return Va(Pa(e)).flatMap((e) => Ua(e, t));
}
function Va(e) {
	return e.reduce((e, t) => {
		if (t.type === "section-heading") return e.push({
			title: Ha(t),
			blocks: [],
			closed: !1
		}), e;
		let n = e.at(-1);
		return n && !n.closed && (n.blocks.push(t), n.closed = t.type === p), e;
	}, []);
}
function Ha({ content: e }) {
	return String(e?.attrs.title ?? "");
}
function Ua(e, t) {
	if (e.blocks.some(Wa)) return [];
	let n = e.blocks.find(Ga);
	if (n) return [Ka(n)];
	let r = e.blocks.find((e) => !d.includes(e.type));
	return r ? [qa(r, e.title, t)] : [];
}
function Wa(e) {
	return !Ra.includes(e.type) && !Ga(e);
}
function Ga({ node: e, content: t, type: n }) {
	return n === Ia && e.childCount === 1 && t?.content.size === 0;
}
function Ka({ pos: e, content: t }) {
	let n = e + 1;
	return T.node(n, n + (t?.nodeSize ?? 0), { "data-plan-placeholder": Fa });
}
function qa({ pos: e, node: t }, n, r) {
	let i = String(t.attrs.id ?? "");
	return T.widget(e, () => Ja(n, () => r(i)), {
		side: -1,
		key: `empty-${i}-${n}`,
		stopEvent: () => !0
	});
}
function Ja(e, t) {
	let n = document.createElement("div");
	return n.className = La, n.contentEditable = "false", n.role = "button", n.tabIndex = 0, n.ariaLabel = `${Fa} in ${e}`, n.textContent = Fa, n.addEventListener("mousedown", (e) => {
		Ya(e, t);
	}), n.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
	}), n;
}
function Ya(e, t) {
	e.preventDefault(), e.button === za && t();
}
function Xa(e, t) {
	e.transact(() => {
		let [n] = e.insertBlocks([{ type: Ia }], t, "before");
		n && e.setTextCursorPosition(n, "start");
	}), e.focus();
}
//#endregion
//#region src/template/platform.ts
var Za = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Qa = [
	"Enter",
	"Backspace",
	"Delete"
], $a = [
	"d",
	"h",
	"k",
	"o",
	"t"
];
function eo(e) {
	let { key: t, metaKey: n } = e;
	return (Qa.includes(t) || [...t].length === 1) && !n && !to(e);
}
function to(e) {
	let t = Za && $a.includes(e.key);
	return e.ctrlKey && !t && !e.getModifierState("AltGraph");
}
//#endregion
//#region src/template/empty-section.ts
var no = new Re("planEmptySection"), Q = j.filter((e) => e !== "plan-title"), ro = ".bn-block-group, .bn-block-outer, .bn-block", io = "button, input, textarea, select, a, [role='button']", ao = ":disabled, [aria-disabled='true']", oo = ["section-panel", "section-actions"], so = 1, co = b(({ editor: e }) => ({
	key: "planEmptySection",
	prosemirrorPlugins: [new S({
		key: no,
		props: lo(e)
	})]
}))();
function lo(e) {
	let t = (t) => Xa(e, t);
	return {
		decorations: (n) => e.isEditable ? E.create(n.doc, Ba(n.doc, t)) : E.empty,
		handleDOMEvents: { mousedown: uo },
		handleClickOn: Ao,
		handleKeyDown: ho,
		handlePaste: mo
	};
}
function uo(e, t) {
	let n = e.editable && po(e, t);
	return n && Aa(e), (n || wo(e, t.target)) && fo(e, t) && ja(e), n;
}
function fo(e, t) {
	return e.editable && t.button === so;
}
function po(e, t) {
	return xo(e, t) || So(e, t);
}
function mo(e, t) {
	return e.editable && !yo(t.target) && go(e);
}
function ho(e, t) {
	return eo(t) && !yo(t.target) && go(e);
}
function go(e) {
	return bo(e.state.selection) || _o(e);
}
function _o(e) {
	let t = vo(e), n = t instanceof Element ? t : t?.parentElement;
	return n && e.dom.contains(n) ? Q.includes(Eo(n)) : !1;
}
function vo({ root: e, dom: t }) {
	return (e.getSelection?.() ?? t.ownerDocument.getSelection())?.anchorNode;
}
function yo(e) {
	let t = e instanceof Element ? e.closest(io) : null;
	return t !== null && !t.matches(ao);
}
function bo(e) {
	if (!(e instanceof x)) return !1;
	let { type: t } = e.node;
	return Q.includes(t.name);
}
function xo(e, t) {
	return !Do(e, t.target) || !Oo(e, t) ? !1 : (t.preventDefault(), !0);
}
function So(e, t) {
	return Co(e, t.target) ? (t.preventDefault(), !0) : !1;
}
function Co(e, t) {
	if (!(t instanceof Element) || !e.dom.contains(t)) return !1;
	let n = Eo(t);
	return Q.includes(n) && !yo(t) && !(oo.includes(n) && To(t));
}
function wo(e, t) {
	return t instanceof Element && e.dom.contains(t) && Q.includes(Eo(t));
}
function To(e) {
	return [...e.childNodes].some((e) => e instanceof Text && e.data.trim() !== "");
}
function Eo(e) {
	return e.closest(".bn-block-content")?.getAttribute("data-content-type") ?? "";
}
function Do(e, t) {
	return t instanceof Element && (t === e.dom || t.matches(ro));
}
function Oo(e, t) {
	let n = Pa(e.state.doc).filter((n) => ko(e, n, t.clientY));
	return n.length > 0 && n.every((e) => Q.includes(e.type));
}
function ko(e, { pos: t }, n) {
	let r = e.nodeDOM(t);
	if (!(r instanceof Element)) return !1;
	let { top: i, bottom: a } = r.getBoundingClientRect();
	return i <= n && n <= a;
}
function Ao(...[e, , t]) {
	return e.editable && Q.includes(t.type.name);
}
//#endregion
//#region src/template/section-moves.ts
var jo = {
	ArrowUp: "up",
	ArrowDown: "down"
}, Mo = 3, No = 2, Po = b({
	key: "planSectionMoves",
	prosemirrorPlugins: [new S({ props: { handleKeyDown: Fo } })]
});
function Fo(e, t) {
	let n = Io(t);
	if (!n) return !1;
	let r = Pa(e.state.doc), i = Ro(e.state, r), a = i < 0 ? "one-step" : Vo(n, r, i);
	return typeof a == "number" && e.dispatch(Go(e.state, r[i], a)), a !== "one-step";
}
function Io(e) {
	return Lo(e) && e.shiftKey && !e.altKey ? jo[e.key] : void 0;
}
function Lo({ metaKey: e, ctrlKey: t }) {
	return Za ? e && !t : t && !e;
}
function Ro(e, t) {
	let { selection: n } = e;
	return zo(n) ? t.findIndex(({ pos: e, node: t, type: r }) => e < n.from && n.to < e + t.nodeSize && !j.includes(r)) : -1;
}
function zo(e) {
	let { $from: t, $to: n } = e, r = Bo(e);
	return t.depth <= r && n.depth <= r;
}
function Bo(e) {
	return e instanceof x ? No : e instanceof ze ? Mo : -1;
}
function Vo(e, t, n) {
	return e === "down" ? Ho(t, n) : Uo(t, n);
}
function Ho(e, t) {
	if (e[t + 1]?.type !== p) return "one-step";
	let n = e.findIndex((e, n) => n > t && e.type === "section-heading");
	return e.find((e, t) => n >= 0 && t > n && !d.includes(e.type))?.pos ?? "nowhere";
}
function Uo(e, t) {
	let n = e.slice(0, t).reverse(), r = n.find((e) => !d.includes(e.type));
	if (!r || r.type !== "section-heading") return "one-step";
	let i = n.find((e) => e.pos < r.pos && [p, "section-heading"].includes(e.type));
	return i?.type === p ? i.pos : Wo(i, r);
}
function Wo(e, t) {
	return e ? t.pos : "nowhere";
}
function Go(e, t, n) {
	let { tr: r, selection: i } = e;
	if (!t) return r;
	let { pos: a, node: o } = t;
	r.delete(a, a + o.nodeSize);
	let s = r.mapping.map(n);
	return r.insert(s, o), r.setSelection(Ko(r.doc, i, s - a)).scrollIntoView();
}
function Ko(e, t, n) {
	return t instanceof x ? x.create(e, t.from + n) : ze.create(e, t.anchor + n, t.head + n);
}
//#endregion
//#region src/use-plan-editor.ts
function qo({ session: e, meta: t, user: n, onChange: r }) {
	let i = c(() => /* @__PURE__ */ new Map(), []), o = Jo(e, n, i), s = Xo(o, e, a((e) => r?.(Kt(e, t)), [t, r]));
	return {
		editor: o,
		plan: c(() => Kt(s, t), [s, t]),
		hosts: i
	};
}
function Jo(e, t, n) {
	let { doc: r } = e;
	return Me(ct({
		schema: Br,
		extensions: Yo(r, n),
		collaboration: {
			fragment: r.getXmlFragment(ie),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Ni
		}
	}), [e]);
}
function Yo(e, t) {
	return [
		St,
		co,
		Po,
		Ca(e, t)
	];
}
function Xo(e, t, n) {
	let [r, i] = u(() => et(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Zo = {};
function Qo({ transport: e, adapters: t = Zo, className: n, ...r }) {
	let i = ba(e), a = $o(r);
	return /* @__PURE__ */ g(lt, {
		value: t,
		children: /* @__PURE__ */ g("div", {
			className: es({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ g(ts, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ g($i, { status: "connecting" })
		})
	});
}
function $o({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function es({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ts({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = xa(t.session);
	if (!r) return /* @__PURE__ */ g($i, {
		status: n,
		reason: i
	});
	let a = e ?? xe(r.type);
	return /* @__PURE__ */ _(V, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ g($i, {
			status: n,
			reason: i
		}), /* @__PURE__ */ g(ns, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ns({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: ee } = qo(r), c = rs(i, o, ee), l = fs(s, e, t);
	return Ri(o, i.awareness), /* @__PURE__ */ g(ut, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ g(is, {
			...r,
			...c,
			...s,
			report: l
		})
	});
}
function rs(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function is(e) {
	let t = os(e.sections);
	return /* @__PURE__ */ _(Yn, {
		value: t,
		children: [/* @__PURE__ */ g(ds, { ...e }), /* @__PURE__ */ g(as, {
			...e,
			titles: t
		})]
	});
}
function as({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ _("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ g(ss, { ...n }), t && /* @__PURE__ */ g(cs, { ...n })]
	});
}
function os(e) {
	return c(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function ss({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ g(Wi, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => Ji(e, t.clientId)
	});
}
function cs({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = us(r.sections);
	return /* @__PURE__ */ g(oi, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => ls(e, t),
		children: n
	});
}
function ls(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function us(e) {
	return c(() => ve(Se({ sections: e }), e.map((e) => e.slot)), [e]);
}
function ds({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = ea(n, () => ps(e));
	return /* @__PURE__ */ _(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ g(Xr, {}),
			/* @__PURE__ */ g(Lt, {}),
			/* @__PURE__ */ g(dt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function fs(e, t, n) {
	let r = c(() => Te(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function ps(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ms(e) {
	let t = Qe(e.blocks), n = new nt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return gs(r), {
		doc: t,
		connect: () => vs(r)
	};
}
function hs(e) {
	return ms(e).connect();
}
function gs(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => _s(t, n, {
		type: "update",
		update: w(e)
	})), r.on("update", (n, i) => {
		let a = it(r, e(n));
		_s(t, i, {
			type: "awareness",
			update: w(a)
		});
	});
}
function _s(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function vs(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ys(e, t, n),
		subscribe: (n) => (t.handlers.add(n), bs(e, n), () => t.handlers.delete(n))
	};
}
function ys(e, t, n) {
	if (n.type === "update") {
		ot(e.doc, C(n.update), t);
		return;
	}
	rt(e.awareness, C(n.update), t);
}
function bs({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: w(st(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = it(t, i);
		r({
			type: "awareness",
			update: w(e)
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
}, xs = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Ss({ before: e, after: t, className: n }) {
	let r = se(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ _("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ g("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ g(Cs, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ g(ws, { section: e }, e.slot)),
			/* @__PURE__ */ g(Ts, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Cs({ changes: e }) {
	return /* @__PURE__ */ g("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ _("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function ws({ section: e }) {
	return /* @__PURE__ */ _("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ g("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ g("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ _("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ _("span", {
					"aria-hidden": "true",
					children: [xs[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Ts({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ _("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ g("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ g("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ _("li", {
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
export { Ss as PlanDiffView, Qo as PlanEditor, Ct as bypassTemplate, ms as createMemoryHub, Gt as fromEditorBlocks, hs as localTransport, Br as planSchema, Kt as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map