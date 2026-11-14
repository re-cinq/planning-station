import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { MARGIN_NOTES as f, NOT_CONTENT as ne, PLAN_BLOCK_CONFIGS as p, PLAN_FRAGMENT as re, SECTION_ACTIONS as m, actionsBlockId as ie, applyOps as ae, changeWords as oe, diffPlans as se, findSectionSlot as h, isMeaningful as ce, isPlanBlock as le, isRemovableSlot as ue, isRequiredAt as de, newId as g, optionsOf as fe, parseBlock as pe, partitionSections as me, plainText as he, previewProposal as ge, refineInputs as _e, settledBySlot as ve, settledCount as ye, tableCells as be, templateFor as xe, toBlocks as Se, toPlanDocument as Ce, usesOf as we, validatePlan as Te } from "@re-cinq/planning-document";
import { createPortal as Ee } from "react-dom";
import { Fragment as _, jsx as v, jsxs as y } from "react/jsx-runtime";
import { offset as De } from "@floating-ui/react";
import { SideMenuExtension as Oe } from "@blocknote/core/extensions";
import { SideMenu as ke, SideMenuController as Ae, SuggestionMenuController as je, createReactBlockSpec as b, useBlockNoteEditor as x, useCreateBlockNote as Me, useEditorChange as Ne, useExtensionState as Pe } from "@blocknote/react";
import { BlockNoteSchema as Fe, createExtension as S, filterSuggestionItems as Ie, insertOrUpdateBlockForSlashMenu as Le } from "@blocknote/core";
import { NodeSelection as C, Plugin as w, PluginKey as Re, TextSelection as ze } from "prosemirror-state";
import { yCursorPluginKey as Be, ySyncPluginKey as Ve } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as He, acceptChange as Ue, acceptRefine as We, applyChangeAnyway as Ge, applyOpsToDoc as Ke, applyRefineAnyway as qe, askRefine as Je, changesIn as Ye, discardChange as Xe, discardRefine as Ze, docFromBlocks as Qe, fromBase64 as T, proposalsIn as $e, readBlocks as et, staleChanges as tt, toBase64 as E } from "@re-cinq/planning-yjs";
import { Awareness as nt, applyAwarenessUpdate as rt, encodeAwarenessUpdate as it } from "y-protocols/awareness";
import { Doc as at, applyUpdate as ot, encodeStateAsUpdate as st } from "yjs";
import { withCollaboration as ct } from "@blocknote/core/yjs";
import { Decoration as lt, DecorationSet as D } from "prosemirror-view";
//#region src/blocks/adapters.ts
var ut = n({}), dt = n({ user: {
	id: "",
	name: "Someone"
} });
function O() {
	return i(dt);
}
var k = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
}, A = {
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
	return /* @__PURE__ */ v(_, { children: e.map((e) => /* @__PURE__ */ v(pt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function pt({ review: e, host: t }) {
	return t ? Ee(/* @__PURE__ */ v(mt, { review: e }), t) : null;
}
function mt({ review: e }) {
	return /* @__PURE__ */ y("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: k.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v(_t, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ v(ht, {}),
			/* @__PURE__ */ v(gt, { review: e })
		]
	});
}
function ht() {
	return /* @__PURE__ */ v("p", {
		className: k.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function gt({ review: e }) {
	return /* @__PURE__ */ y("p", {
		className: k.bar,
		children: [/* @__PURE__ */ v("button", {
			type: "button",
			className: A.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ v("button", {
			type: "button",
			className: A.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function _t({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ v(vt, { removal: t }) : oe(e).map((e, t) => /* @__PURE__ */ v("p", {
		className: k.words,
		children: e
	}, t));
}
function vt({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : bt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ v("p", {
		className: k.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ v("p", {
		className: k.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ v("p", {
		className: k.dropped,
		children: /* @__PURE__ */ v("del", { children: e })
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
var xt = "planTemplateBypass", St = "section-heading", Ct = "blockContent", j = [
	"plan-title",
	St,
	"section-panel",
	m
], wt = S({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new w({ filterTransaction: Et })]
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
	let t = e.getMeta(Ve);
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
	return e.filter((e) => j.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
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
	middleware: [De(({ elements: e, rects: t }) => {
		let n = Vt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function zt() {
	return /* @__PURE__ */ v(Ae, {
		floatingUIOptions: Rt,
		sideMenu: Bt
	});
}
function Bt() {
	let e = Pe(Oe, { selector: (e) => e?.block.type });
	return e === void 0 || j.includes(e) ? null : /* @__PURE__ */ v(ke, {});
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
function Jt(e, t) {
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
}, Yt = { props: { resolved: !0 } }, Xt = { props: { resolved: !1 } };
function Zt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = dn(P(e));
	return /* @__PURE__ */ y("aside", {
		className: M.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${hn(e)}`,
		...$t({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ v(en, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ v("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ v(Qt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Qt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ y("div", {
		className: M.actions,
		contentEditable: !1,
		children: [mn(e) && /* @__PURE__ */ v(tn, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ v(nn, {
			block: e,
			editor: t
		})]
	});
}
function $t({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function en({ block: e, resolved: t }) {
	return /* @__PURE__ */ y("p", {
		className: M.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v("span", {
				className: M.author,
				children: hn(e)
			}),
			/* @__PURE__ */ v("time", {
				className: M.when,
				children: _n(e.props.at)
			}),
			t && /* @__PURE__ */ v("span", {
				className: M.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function tn({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ v(N, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Xt)
	}) : /* @__PURE__ */ v(sn, {
		block: e,
		editor: t
	});
}
function nn({ block: e, editor: t }) {
	let [n, r] = d(!1), i = on(e);
	return /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ v(N, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ v(rn, {
		question: an(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function rn({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ y("div", {
		className: M.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v("p", {
				className: M.question,
				children: e
			}),
			/* @__PURE__ */ v(N, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ v(N, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function an(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function on(e) {
	let t = x();
	if (!mn(e)) return [e];
	let n = P(e);
	return t.document.filter((e) => e.type === "comment" && P(e) === n);
}
function sn({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ y(_, { children: [n ? /* @__PURE__ */ v(cn, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ v(N, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ v(N, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Yt)
	})] });
}
function N({ label: e, onClick: t }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function cn({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = un({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ v("form", {
		className: M.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ v(ln, {
			to: hn(e),
			draft: r,
			onDraft: i
		})
	});
}
function ln({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ v("input", {
		className: M.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function un({ editor: e, block: t }) {
	let { user: n } = O(), r = x();
	return (i) => {
		if (!i) return;
		let a = P(t), o = r.document, s = pn(o, a) ?? t;
		e.insertBlocks([gn(a, i, n.name)], s, "after");
	};
}
function dn(e) {
	let t = x(), n = () => fn(t.document, e), [r, i] = d(n);
	return Ne(() => i(n())), r;
}
function fn(e, t) {
	return e.some((e) => mn(e) && P(e) === t && e.props.resolved === !0);
}
function pn(e, t) {
	return e.filter((e) => e.type === "comment" && P(e) === t).at(-1);
}
function mn(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function P(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function hn(e) {
	return String(e.props.author || "Someone");
}
function gn(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: g("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function _n(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var F = {
	finding: "_finding_gtne7_1",
	who: "_who_gtne7_24",
	label: "_label_gtne7_37",
	why: "_why_gtne7_41",
	text: "_text_gtne7_45",
	actions: "_actions_gtne7_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function vn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ y("aside", {
		className: F.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": xn(r),
		children: [
			/* @__PURE__ */ v(yn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ v("div", {
				className: F.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ v(bn, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function yn({ severity: e, why: t }) {
	return /* @__PURE__ */ y("p", {
		className: F.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("span", {
			className: F.label,
			children: xn(e)
		}), t && /* @__PURE__ */ v("span", {
			className: F.why,
			children: t
		})]
	});
}
function bn({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ v("div", {
		className: F.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ v("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function xn(e) {
	return `Finding · ${e}`;
}
var I = {
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
function Sn({ block: e }) {
	let { renderMockup: t } = o(ut);
	return /* @__PURE__ */ y("figure", {
		className: I.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ v(Cn, { mockup: e.props }), t ? t(e.props) : /* @__PURE__ */ v("p", { children: "The host renders mockups; none is configured." })]
	});
}
function Cn({ mockup: e }) {
	return /* @__PURE__ */ y("figcaption", {
		className: I.label,
		children: [e.caption || "Sketch", e.kind && /* @__PURE__ */ v("span", {
			className: I.kind,
			children: e.kind
		})]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var wn = {
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
}, Tn = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, En = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function Dn({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: Tn.steps,
		disabled: r
	};
	return /* @__PURE__ */ y("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ v("legend", {
			className: Tn.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ v(On, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function On({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ y("label", {
		className: Tn.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ v("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), En[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var kn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function An(e, t) {
	return e[String(t)] ?? String(t);
}
var jn = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function Mn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ y("span", {
		className: jn.field,
		"data-field": e,
		children: [/* @__PURE__ */ v("label", {
			className: jn.label,
			htmlFor: n,
			children: An(kn, e)
		}), /* @__PURE__ */ v(Nn, {
			...t,
			id: n
		})]
	});
}
function Nn(e) {
	return e.spec.values ? /* @__PURE__ */ v(Pn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ v(Fn, { ...e });
}
function Pn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ v("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ v("option", { children: e }, e))
	});
}
function Fn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ v("input", {
		id: e,
		className: jn.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var In = { maturity: Dn };
function Ln({ block: e, editor: t, contentRef: n }) {
	let r = wn[e.type];
	return /* @__PURE__ */ y("div", {
		className: I.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ v(Rn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ v("div", {
			className: I.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function Rn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ y("div", {
		className: I.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ y("p", {
			className: I.head,
			children: [/* @__PURE__ */ v("span", {
				className: I.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ v(zn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ v(Bn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function zn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ y("a", {
		className: I.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ v("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function Bn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = p[e.type], o = a;
	return r(In[n] ?? Mn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Vn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Hn({ contentRef: e }) {
	return /* @__PURE__ */ v("h1", {
		className: Vn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var L = {
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
function Un({ block: e, editor: t, contentRef: n }) {
	let r = fe(e.props.options);
	return /* @__PURE__ */ y("div", {
		className: L.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ v(Wn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ v("div", {
				className: L.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ v(Gn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Wn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ v("p", {
		className: L.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ v("span", {
			className: L.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ y("p", {
		className: L.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v("span", {
				className: L.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ v("span", {
				className: L.why,
				children: e
			}),
			/* @__PURE__ */ v("span", {
				className: L.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Gn({ block: e, editor: t, options: n }) {
	return Zn($n(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ v(Kn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ v(Jn, {
		block: e,
		editor: t
	});
}
function Kn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ v("ul", {
		className: L.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ v("li", { children: /* @__PURE__ */ v(qn, {
			onPick: () => Xn(t, e, n),
			children: n
		}) }, n))
	});
}
function qn({ onPick: e, children: t }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: L.suggestion,
		onClick: e,
		children: t
	});
}
function Jn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ y("form", {
		className: L.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Xn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ v(Yn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ v("button", {
			type: "submit",
			className: L.answerButton,
			children: "Answer"
		})]
	});
}
function Yn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ v("input", {
		className: L.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Xn(e, t, n) {
	if (!n) return;
	let r = $n(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Zn(e) {
	let t = x(), [n, r] = d(() => Qn(t.document, e));
	return Ne(() => r(Qn(t.document, e))), n;
}
function Qn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function $n(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/session/remove-section.ts
function er(e, t) {
	Ke(e, [{
		op: "remove-section",
		slot: t
	}]);
}
//#endregion
//#region src/template/template-context.ts
var R = n(null), tr = n(/* @__PURE__ */ new Map());
function nr(e) {
	let t = o(R), n = o(tr).get(e);
	return t ? h(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var rr = /* @__PURE__ */ new WeakMap();
function ir(e) {
	let t = rr.get(e);
	if (t) return t;
	let n = et(e);
	return rr.set(e, n), e.once("update", () => rr.delete(e)), n;
}
//#endregion
//#region src/session/use-doc-version.ts
function z(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
var B = {
	generate: "_generate_en660_1",
	bar: "_bar_en660_8",
	note: "_note_en660_16",
	button: "_button_en660_21",
	failed: "_failed_en660_45"
}, ar = "prototype", or = "The agent draws diagrams and screen sketches from this plan.";
function sr({ doc: e, slot: t }) {
	let { onGeneratePrototype: n } = O(), r = fr(e, t);
	return t !== ar || !n || r ? null : /* @__PURE__ */ v(cr, { generate: n });
}
function cr({ generate: e }) {
	let { asking: t, refusal: n, ask: r } = lr(e);
	return /* @__PURE__ */ y("div", {
		className: B.generate,
		children: [/* @__PURE__ */ y("p", {
			className: B.bar,
			children: [/* @__PURE__ */ v("button", {
				type: "button",
				className: B.button,
				disabled: t,
				onClick: r,
				children: t ? "Asking the agent…" : "Generate prototype"
			}), /* @__PURE__ */ v("span", {
				className: B.note,
				children: or
			})]
		}), n && /* @__PURE__ */ v(ur, { reason: n })]
	});
}
function lr(e) {
	let [t, n] = d(!1), [r, i] = d(null);
	return {
		asking: t,
		refusal: r,
		ask: () => {
			n(!0), i(null), e().catch((e) => i(dr(e))).finally(() => n(!1));
		}
	};
}
function ur({ reason: e }) {
	return /* @__PURE__ */ y("p", {
		className: B.failed,
		role: "alert",
		children: ["The agent cannot draw the prototype now: ", e]
	});
}
function dr(e) {
	return e instanceof Error ? e.message : String(e);
}
function fr(e, t) {
	let n = z(e);
	return l(() => me(ir(e)).find((e) => e.slot === t)?.blocks.some(ce) ?? !1, [
		e,
		t,
		n
	]);
}
//#endregion
//#region src/session/use-section-refine.ts
function pr(e, t) {
	let n = z(e);
	return l(() => {
		let n = ir(e), r = _e(n, t), i = $e(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ye(r),
			proposal: a,
			busyFor: mr(i, t),
			preview: a?.status === "proposed" ? ge(n, a) : void 0,
			...hr(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function mr(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function hr(e, t, n) {
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
function gr(e) {
	let t = pr(e.doc, e.slot), [n, r] = d(null), i = vr(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ v(_r, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ v(br, { ...a });
}
function _r({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ v(Tr, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ v(Er, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ v(Dr, {
			...t,
			proposal: e
		});
	}
}
function vr({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = O();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(yr(e));
		});
	};
}
function yr(e) {
	return e instanceof Error ? e.message : String(e);
}
function br({ refine: e, ask: t, refusal: n }) {
	let r = e.settled === 0 && e.busyFor === void 0;
	return /* @__PURE__ */ y(_, { children: [n && /* @__PURE__ */ v(Cr, { reason: n }), r ? /* @__PURE__ */ v(xr, {}) : /* @__PURE__ */ v(Sr, {
		refine: e,
		ask: t
	})] });
}
function xr() {
	return /* @__PURE__ */ v("p", {
		className: A.hint,
		children: "Nothing for the agent to refine yet. Answer a question in this section or resolve a comment, and Refine appears here."
	});
}
function Sr({ refine: e, ask: t }) {
	let n = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ y("p", {
		className: A.bar,
		children: [/* @__PURE__ */ v(V, {
			label: "Refine this section",
			run: t,
			disabled: !n
		}), /* @__PURE__ */ v("span", {
			className: A.note,
			children: wr(e)
		})]
	});
}
function Cr({ reason: e }) {
	return /* @__PURE__ */ y("p", {
		className: A.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function wr(e) {
	return e.busyFor === void 0 ? `uses ${Mr(e)}` : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function Tr({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ y("p", {
		className: A.bar,
		role: "status",
		children: [/* @__PURE__ */ y("span", {
			className: A.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ v("button", {
			type: "button",
			className: A.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Er({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ y("section", {
		className: A.proposal,
		children: [/* @__PURE__ */ y("p", {
			className: A.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ y("p", {
			className: A.bar,
			children: [
				/* @__PURE__ */ v(V, {
					label: "Ask again",
					run: t,
					disabled: e.busyFor !== void 0
				}),
				/* @__PURE__ */ v(H, {
					label: "Dismiss",
					run: e.discard
				}),
				/* @__PURE__ */ v(kr, { refine: e })
			]
		})]
	});
}
function Dr({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ y("section", {
		className: A.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ y("p", {
				className: A.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					Nr(r)
				]
			}),
			/* @__PURE__ */ v(Ar, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ y("p", {
				className: A.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ v(Or, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function Or({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ y("p", {
		className: A.bar,
		children: [
			/* @__PURE__ */ v(V, {
				label: r,
				run: i,
				disabled: a
			}),
			n && /* @__PURE__ */ v(H, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ v(H, {
				label: "Discard",
				run: e.discard
			}),
			n && /* @__PURE__ */ v(kr, { refine: e })
		]
	});
}
function kr({ refine: e }) {
	return e.busyFor !== void 0 && /* @__PURE__ */ y("span", {
		className: A.note,
		children: [
			"The agent is refining another section for ",
			e.busyFor,
			"; ask again when it finishes"
		]
	});
}
function V({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: A.refine,
		disabled: n,
		onClick: t,
		children: e
	});
}
function H({ label: e, run: t }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: A.quiet,
		onClick: t,
		children: e
	});
}
function Ar({ lines: e }) {
	return /* @__PURE__ */ v("ul", {
		className: A.lines,
		children: e.map((e, t) => /* @__PURE__ */ v("li", {
			className: A[e.kind],
			children: /* @__PURE__ */ v(jr, { line: e })
		}, `${t}-${e.text}`))
	});
}
function jr({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ v("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ v("del", { children: e.text }) : e.text;
}
function Mr({ inputs: e }) {
	return Pr(e.answered.length, e.resolved.length);
}
function Nr({ uses: e }) {
	let t = Pr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Pr(e, t) {
	return [Fr(e, "answer"), Fr(t, "resolved thread")].filter(Boolean).join(", ");
}
function Fr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var U = {
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
function Ir({ block: e, editor: t }) {
	let { slot: n, title: r } = Ur(e), { onRefine: i, doc: a } = O();
	return !a || !t.isEditable ? null : /* @__PURE__ */ y("div", {
		role: "group",
		className: U.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v(sr, {
				doc: a,
				slot: n
			}),
			i && /* @__PURE__ */ v(gr, {
				doc: a,
				slot: n,
				title: r
			}),
			/* @__PURE__ */ v(Lr, {
				doc: a,
				slot: n,
				title: r
			})
		]
	});
}
function Lr({ doc: e, slot: t, title: n }) {
	let r = o(R), [i, a] = d(!1);
	return !r || !ue(r, t) ? null : /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ v(Rr, {
		title: n,
		onClick: () => a(!0)
	}), i && /* @__PURE__ */ v(zr, {
		title: n,
		onConfirm: () => er(e, t),
		onCancel: () => a(!1)
	})] });
}
function Rr({ title: e, onClick: t }) {
	return /* @__PURE__ */ v("button", {
		type: "button",
		className: U.remove,
		"aria-label": `Remove section ${e}`,
		onClick: t,
		children: /* @__PURE__ */ v(Hr, {})
	});
}
function zr({ title: e, onConfirm: t, onCancel: n }) {
	let r = Br(), i = c();
	return /* @__PURE__ */ y("dialog", {
		ref: r,
		className: U.confirm,
		"aria-labelledby": i,
		onClose: n,
		children: [
			/* @__PURE__ */ y("h3", {
				id: i,
				className: U.question,
				children: [
					"Remove ",
					e,
					"?"
				]
			}),
			/* @__PURE__ */ v("p", {
				className: U.explanation,
				children: "Its content, comments and questions are deleted."
			}),
			/* @__PURE__ */ v(Vr, {
				onConfirm: t,
				onCancel: n
			})
		]
	});
}
function Br() {
	let e = u(null);
	return s(() => e.current?.showModal(), []), e;
}
function Vr({ onConfirm: e, onCancel: t }) {
	return /* @__PURE__ */ y("div", {
		className: U.choices,
		children: [/* @__PURE__ */ v("button", {
			type: "button",
			className: U.cancel,
			autoFocus: !0,
			onClick: t,
			children: "Cancel"
		}), /* @__PURE__ */ v("button", {
			type: "button",
			className: U.danger,
			onClick: e,
			children: "Remove"
		})]
	});
}
function Hr() {
	return /* @__PURE__ */ v("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ v("path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" })
	});
}
function Ur(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: nr(t)?.title ?? t
	};
}
var Wr = {
	composer: "_composer_in3m5_1",
	input: "_input_in3m5_8",
	send: "_send_in3m5_25"
};
//#endregion
//#region src/blocks/CommentComposer.tsx
function Gr(e) {
	let { draft: t, setDraft: n, say: r } = Kr(e), { title: i } = e.block.props;
	return /* @__PURE__ */ y("form", {
		className: Wr.composer,
		onSubmit: r,
		children: [/* @__PURE__ */ v(qr, {
			title: i,
			draft: t,
			onDraft: n,
			onLeave: e.onDone
		}), /* @__PURE__ */ v("button", {
			type: "submit",
			className: Wr.send,
			children: "Comment"
		})]
	});
}
function Kr({ block: e, editor: t, onDone: n }) {
	let { user: r } = O(), [i, a] = d("");
	return {
		draft: i,
		setDraft: a,
		say: (a) => {
			let o = i.trim();
			a.preventDefault(), o && (t.insertBlocks([Jr(o, r.name)], { id: ie(e.props.slot) }, "before"), n());
		}
	};
}
function qr({ title: e, draft: t, onDraft: n, onLeave: r }) {
	return /* @__PURE__ */ v("input", {
		className: Wr.input,
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
function Jr(e, t) {
	return {
		type: "comment",
		props: {
			commentId: g("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
var W = {
	heading: "_heading_80g3h_1",
	row: "_row_80g3h_10",
	comment: "_comment_80g3h_17",
	title: "_title_80g3h_44",
	hint: "_hint_80g3h_52"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function Yr({ block: e, editor: t }) {
	let [n, r] = d(!1), { slot: i, title: a } = e.props;
	return /* @__PURE__ */ y("header", {
		className: W.heading,
		"data-slot": i,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ v(Zr, {
				title: a,
				commentable: t.isEditable,
				open: n,
				onToggle: () => r(!n)
			}),
			/* @__PURE__ */ v(Xr, { slot: i }),
			n && /* @__PURE__ */ v(Gr, {
				block: e,
				editor: t,
				onDone: () => r(!1)
			})
		]
	});
}
function Xr({ slot: e }) {
	let t = nr(e)?.hint;
	return t && /* @__PURE__ */ v("p", {
		className: W.hint,
		children: t
	});
}
function Zr({ title: e, commentable: t, open: n, onToggle: r }) {
	return /* @__PURE__ */ y("div", {
		className: W.row,
		children: [/* @__PURE__ */ v("h2", {
			className: W.title,
			children: e
		}), t && /* @__PURE__ */ v(Qr, {
			title: e,
			open: n,
			onToggle: r
		})]
	});
}
function Qr({ title: e, open: t, onToggle: n }) {
	return /* @__PURE__ */ y("button", {
		type: "button",
		className: W.comment,
		"aria-expanded": t,
		"aria-label": `${t ? "Close comment" : "Comment"} on ${e}`,
		onMouseDown: (e) => e.preventDefault(),
		onClick: n,
		children: [/* @__PURE__ */ v($r, {}), "Comment"]
	});
}
function $r() {
	return /* @__PURE__ */ v("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ v("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
	});
}
//#endregion
//#region src/blocks/SectionPanel.tsx
function ei() {
	return null;
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var ti = { render: Ln }, ni = {
	"plan-title": b(p["plan-title"], { render: Hn })(),
	"section-heading": b(p["section-heading"], { render: Yr })(),
	"section-panel": b(p["section-panel"], { render: ei })(),
	"section-actions": b(p["section-actions"], { render: Ir })(),
	comment: b(p.comment, { render: Zt })(),
	finding: b(p.finding, { render: vn })(),
	kpi: b(p.kpi, ti)(),
	prototype: b(p.prototype, ti)(),
	mockup: b(p.mockup, { render: Sn })(),
	question: b(p.question, { render: Un })(),
	answer: b(p.answer, ti)()
}, ri = Fe.create({ blockSpecs: {
	...He,
	...ni
} });
//#endregion
//#region src/menu/section-context.ts
function ii(e, t) {
	let [n] = oi(e, t);
	return n ? String(n.props.slot) : null;
}
function ai(e, t) {
	let n = oi(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function oi(e, t) {
	let n = e.slice(0, si(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function si(e, t) {
	return e.findIndex((e) => ci(e, t));
}
function ci(e, t) {
	return e.id === t || e.children.some((e) => ci(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", li = { cells: [
	"",
	"",
	""
] }, ui = [
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
			rows: [li, li]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: g("kpi") })
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
		props: () => ({ questionId: g("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = ai(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function di(e, t) {
	return ui.filter((t) => e.allows.includes(t.kind)).flatMap((e) => fi(e, t));
}
function fi(e, t) {
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
function pi() {
	let e = x(ri), t = o(R);
	return /* @__PURE__ */ v(je, {
		triggerCharacter: "/",
		getItems: async (n) => Ie(mi(e, t), n)
	});
}
function mi(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && hi(t, i);
	return a ? di(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Le(e, Kt(t))
	})) : [];
}
function hi(e, { blocks: t, cursorId: n }) {
	let r = ii(t, n);
	return r === null ? void 0 : h(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function gi(e, { sections: t, droppedSlots: n = [] }, r) {
	let i = new Set(t.map((e) => e.slot)), a = e.slots.filter((e) => !i.has(e.slot) && !n.includes(e.slot));
	return [...t, ...a].map((t) => ({
		..._i(e, t, r),
		inPlan: i.has(t.slot)
	}));
}
function _i(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && de(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function vi(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
//#endregion
//#region src/outline/section-state.ts
function yi(e, t) {
	return t.length > 0 ? "problem" : e.inPlan ? "ready" : "missing";
}
function bi(e) {
	let t = e.filter(({ section: e }) => e.required);
	return {
		ready: t.filter(({ section: e, problems: t }) => yi(e, t) === "ready").length,
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
}, xi = [], Si = /* @__PURE__ */ new Map(), Ci = /* @__PURE__ */ new Map();
function wi({ approval: e = null, children: t, ...n }) {
	let r = Ai(n);
	return /* @__PURE__ */ y("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ v("p", {
				className: q.phase,
				children: Ei(e, n.report)
			}),
			!e && /* @__PURE__ */ v(Ti, { ...bi(r) }),
			/* @__PURE__ */ v("ol", {
				className: q.slots,
				children: r.map((e) => /* @__PURE__ */ v(Ni, { ...e }, e.section.slot))
			}),
			t && /* @__PURE__ */ v("div", {
				className: q.footer,
				children: t
			})
		]
	});
}
function Ti({ ready: e, total: t }) {
	return t === 0 ? null : /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ y("p", {
		className: q.progress,
		children: [
			e,
			" of ",
			t,
			" required sections ready"
		]
	}), /* @__PURE__ */ v("progress", {
		className: q.bar,
		"aria-label": "Required sections ready",
		value: e,
		max: t
	})] });
}
function Ei(e, t) {
	return e ? Oi(e) : Di(t);
}
function Di(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function Oi({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${ki(t)}`;
}
function ki(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Ai({ template: e, report: t, sections: n = xi, droppedSlots: r, settled: i = Si, failed: a = Ci, onLocate: o }) {
	let s = vi(t.problems);
	return gi(e, {
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
var ji = {
	ready: "ready",
	problem: "needs work",
	missing: "not in the plan"
}, Mi = {
	ready: "✓",
	problem: "!",
	missing: ""
};
function Ni({ problems: e, settled: t, failure: n, ...r }) {
	let { section: i } = r, a = yi(i, e);
	return /* @__PURE__ */ y("li", {
		className: q.slot,
		"aria-label": `${i.title}, ${ji[a]}`,
		children: [
			/* @__PURE__ */ v(Pi, { state: a }),
			/* @__PURE__ */ v(Li, { ...r }),
			i.required && /* @__PURE__ */ v("span", {
				className: q.required,
				children: "required"
			}),
			/* @__PURE__ */ v(Fi, {
				problems: e,
				settled: t,
				failure: n
			})
		]
	});
}
function Pi({ state: e }) {
	return /* @__PURE__ */ v("span", {
		className: q.mark,
		"aria-hidden": "true",
		"data-state": e,
		children: Mi[e]
	});
}
function Fi({ problems: e, settled: t, failure: n }) {
	return /* @__PURE__ */ y(_, { children: [
		/* @__PURE__ */ v(Ii, { text: t > 0 && Ri(t) }),
		/* @__PURE__ */ v(Ii, { text: n && `Refine failed: ${n}` }),
		/* @__PURE__ */ v("ul", {
			className: q.problems,
			children: e.map((e) => /* @__PURE__ */ v("li", { children: e.message }, `${e.code}-${e.message}`))
		})
	] });
}
function Ii({ text: e }) {
	return e && /* @__PURE__ */ v("span", {
		className: q.settled,
		children: e
	});
}
function Li({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ v("span", {
		className: q.title,
		children: e.title
	}) : /* @__PURE__ */ v("button", {
		type: "button",
		className: q.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function Ri(e) {
	return `${e} ${e === 1 ? "settled input" : "settled inputs"} waiting for a refine`;
}
var J = {
	editor: "_editor_1ajpy_1",
	withSidebar: "_withSidebar_1ajpy_9",
	single: "_single_1ajpy_13",
	sidebar: "_sidebar_1ajpy_22"
}, Y = {
	participants: "_participants_ogqfd_1",
	locate: "_locate_ogqfd_16",
	away: "_away_ogqfd_17",
	dot: "_dot_ogqfd_42"
}, X = /* @__PURE__ */ "#c32222.#278643.#9213ec.#827517.#287a8a.#e21283.#338618.#2c288a.#cb4f10.#18865d.#82288a.#677f0a.#2272c3.#8a283c.#0b8916.#5f22c3.#8a6a28.#0b847f.#c3229b.#508226.#1337ec.#c33722.#27864f.#ad13ec.#797915.#286d8a.#e21268.#258618.#39288a.#b85d0f.#18866b.#8a2886.#587f0a.#225ec3.#8a2830.#0b8926.#7422c3.#867327.#0b828e.#c32286.#448226.#131bec.#c34b22.#27865b.#c513e7.#6c7915.#28618a.#e7134f.#188618.#45288a".split(".");
function zi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(Bi)) t.has(n.userId) || t.set(n.userId, Hi(n.color, [...t.values()]));
	return t;
}
function Bi(e, t) {
	return Number(Vi(t)) - Number(Vi(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Vi({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function Hi(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Ui(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Wi(e, n)]);
}
function Wi(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Ji(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: Yi(n),
		hasCursor: r != null
	};
}
function Gi(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Ki(e, t)] : []);
}
function Ki(e, t) {
	return {
		clientId: e,
		userId: Ji(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function qi(e, t) {
	let n = e.get(t)?.user, r = n && zi(Gi(e)).get(Ji(t, n));
	return r === n?.color ? void 0 : r;
}
function Ji(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Yi(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Xi(e, t, n) {
	let r = e.slot && h(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Zi = "⁠";
function Qi(e) {
	let t = `background-color: var(${ea(e.id ?? "")}, ${e.color}); color: white`, n = na("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = na("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = na("bn-collaboration-cursor__base");
	return i.append(Zi, r, Zi), i;
}
function $i(e, t) {
	t.forEach((t) => e.style.setProperty(ea(t.id), t.color));
}
function ea(e) {
	return `--ps-peer-${[...e].map(ta).join("")}`;
}
function ta(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function na(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function ra(e) {
	let [t, n] = d(() => la(e));
	return sa(e, () => n(la(e))), t;
}
function ia(e, t) {
	ca(e, t), aa(t), oa(e, t);
}
function aa(e) {
	sa(e, () => {
		let t = qi(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function oa(e, t) {
	sa(t, () => {
		let n = e.domElement;
		n && $i(n, la(t));
	});
}
function sa(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function ca(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: ii(r, n.id) });
	}), [e, t]);
}
function la(e) {
	return Ui(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function ua({ awareness: e, ...t }) {
	let n = ra(e);
	return n.length === 0 ? null : /* @__PURE__ */ v("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ v("li", { children: /* @__PURE__ */ v(da, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function da({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Xi(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ v("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: fa,
		onClick: () => r(e),
		children: /* @__PURE__ */ v(pa, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ v("span", {
		className: Y.away,
		children: /* @__PURE__ */ v(pa, {
			color: e.color,
			label: i
		})
	});
}
function fa(e) {
	e.preventDefault();
}
function pa({ color: e, label: t }) {
	return /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ v("svg", {
		className: Y.dot,
		viewBox: "0 0 2 2",
		"aria-hidden": "true",
		children: /* @__PURE__ */ v("circle", {
			cx: "1",
			cy: "1",
			r: "1",
			fill: e
		})
	}), t] });
}
//#endregion
//#region src/presence/scroll-to-cursor.ts
function ma(e, t) {
	let n = e.prosemirrorView, r = ha(n, t);
	r !== null && ga(n, r)?.scrollIntoView({ block: "center" });
}
function ha(e, t) {
	let [n] = Be.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function ga(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
//#endregion
//#region src/session/refine-failures.ts
function _a(e, t) {
	return e.flatMap((e) => e.status === "failed" ? [{
		slot: e.slot,
		title: t.get(e.slot) ?? e.slot,
		reason: e.reason
	}] : []);
}
function va(e, t, n) {
	let r = z(e), i = l(() => _a($e(e), t), [
		e,
		t,
		r
	]);
	return ya(i, n), l(() => new Map(i.map(({ slot: e, reason: t }) => [e, t])), [i]);
}
function ya(e, t) {
	let n = u(void 0), r = JSON.stringify(e);
	s(() => {
		n.current !== r && (n.current = r, t?.(e));
	});
}
var ba = { notice: "_notice_1xdcv_1" }, xa = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Sa({ status: e, reason: t }) {
	return /* @__PURE__ */ y("p", {
		className: ba.notice,
		role: "status",
		"data-status": e,
		children: [xa[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Ca(e, t) {
	let n = Na(e, t);
	return l(() => wa(e), [e, n]);
}
function wa(e) {
	let t = new Set(tt(e).map((e) => e.changeId)), n = ir(e);
	return Ye(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: Ea(n, r),
		write: () => t.has(r.changeId) ? Ge(e, r.changeId) : Ue(e, r.changeId),
		discard: () => Xe(e, r.changeId)
	}));
}
var Ta = {
	"remove-block": Da,
	"set-section-text": Oa,
	"set-section-prose": Oa
};
function Ea(e, t) {
	let n = Ta[t.op.op];
	return n && oe(t).length === 0 ? n(e, t) : void 0;
}
function Da(e, t) {
	let n = e.flatMap(Aa).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: Z(n)
	};
}
function Oa(e, { op: t, slot: n }) {
	let r = new Set(ka(ae(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: ka(e, n).filter((e) => !r.has(e.id)).flatMap(Z)
	};
}
function ka(e, t) {
	return me(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Aa(e) {
	return [e, ...ja(e).flatMap(Aa)];
}
function ja(e) {
	return le(e) ? [] : e.children;
}
function Z(e) {
	return [Ma(e.content), ...ja(e).flatMap(Z)].filter(Boolean);
}
function Ma(e) {
	return Array.isArray(e) ? he(e) : be(e).flat().map(he).join(" · ");
}
function Na(e, t) {
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
var Pa = "plan-transport", Fa = class extends nt {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Ia(e) {
	let t = new at(), n = {
		doc: t,
		awareness: new Fa(t)
	}, r = Ra({
		status: "connecting",
		meta: null
	});
	Va(n, e);
	let i = e.subscribe((e) => Ba({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => La(n, i)
	};
}
function La({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Ra(e) {
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
var za = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		ot(e, T(n), Pa), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => ot(e, T(t), Pa),
	awareness: ({ awareness: e }, { update: t }) => rt(e, T(t), Pa),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Ba(e, t) {
	za[t.type](e, t);
}
function Va({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: E(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = it(n, e(t));
		r.send({
			type: "awareness",
			update: E(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function Ha(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = Ia(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Ua(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Wa = new Re("planChangeWidgets");
function Ga(e, t) {
	return S({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new w({
			key: Wa,
			props: { decorations: (n) => D.create(n.doc, Ka(n, e, t)) }
		})]
	});
}
function Ka(e, t, n) {
	let r = Xa(e);
	return Ye(t).flatMap((e) => {
		let t = qa(r, e);
		return t === void 0 ? [] : [Ja(t, e, n)];
	});
}
function qa(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ja(e, t, n) {
	return lt.widget(e, () => Ya(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Ya(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Xa(e) {
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
var Za = [
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"CapsLock"
];
function Qa(e) {
	let { dom: t } = e;
	t instanceof HTMLElement && t.blur();
}
function $a(e) {
	let { dom: t } = e, n = new AbortController(), { signal: r } = n, i = {
		capture: !0,
		signal: r
	}, { ownerDocument: a } = t;
	a.addEventListener("paste", eo(t), i), a.addEventListener("pointerup", () => {
		setTimeout(() => n.abort());
	}, i), a.addEventListener("keydown", to(n), i), a.defaultView?.addEventListener("blur", () => n.abort(), { signal: r });
}
function eo(e) {
	return (t) => {
		t.target instanceof Node && e.contains(t.target) && (t.preventDefault(), t.stopPropagation());
	};
}
function to(e) {
	return ({ key: t }) => {
		Za.includes(t) || e.abort();
	};
}
//#endregion
//#region src/template/top-blocks.ts
var no = "section-heading";
function ro(e) {
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
var io = "Write here…", ao = "paragraph", oo = "ps-empty-section", so = [
	...ne,
	"question",
	"answer"
], co = 0;
function lo(e, t) {
	return uo(ro(e)).flatMap((e) => po(e, t));
}
function uo(e) {
	return e.reduce((e, t) => {
		if (t.type === "section-heading") return e.push({
			title: fo(t),
			blocks: [],
			closed: !1
		}), e;
		let n = e.at(-1);
		return n && !n.closed && (n.blocks.push(t), n.closed = t.type === m), e;
	}, []);
}
function fo({ content: e }) {
	return String(e?.attrs.title ?? "");
}
function po(e, t) {
	if (e.blocks.some(mo)) return [];
	let n = e.blocks.find(ho);
	if (n) return [go(n)];
	let r = e.blocks.find((e) => !f.includes(e.type));
	return r ? [_o(r, e.title, t)] : [];
}
function mo(e) {
	return !so.includes(e.type) && !ho(e);
}
function ho({ node: e, content: t, type: n }) {
	return n === ao && e.childCount === 1 && t?.content.size === 0;
}
function go({ pos: e, content: t }) {
	let n = e + 1;
	return lt.node(n, n + (t?.nodeSize ?? 0), { "data-plan-placeholder": io });
}
function _o({ pos: e, node: t }, n, r) {
	let i = String(t.attrs.id ?? "");
	return lt.widget(e, () => vo(n, () => r(i)), {
		side: -1,
		key: `empty-${i}-${n}`,
		stopEvent: () => !0
	});
}
function vo(e, t) {
	let n = document.createElement("div");
	return n.className = oo, n.contentEditable = "false", n.role = "button", n.tabIndex = 0, n.ariaLabel = `${io} in ${e}`, n.textContent = io, n.addEventListener("mousedown", (e) => {
		yo(e, t);
	}), n.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
	}), n;
}
function yo(e, t) {
	e.preventDefault(), e.button === co && t();
}
function bo(e, t) {
	e.transact(() => {
		let [n] = e.insertBlocks([{ type: ao }], t, "before");
		n && e.setTextCursorPosition(n, "start");
	}), e.focus();
}
//#endregion
//#region src/template/platform.ts
var xo = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), So = [
	"Enter",
	"Backspace",
	"Delete"
], Co = [
	"d",
	"h",
	"k",
	"o",
	"t"
];
function wo(e) {
	let { key: t, metaKey: n } = e;
	return (So.includes(t) || [...t].length === 1) && !n && !To(e);
}
function To(e) {
	let t = xo && Co.includes(e.key);
	return e.ctrlKey && !t && !e.getModifierState("AltGraph");
}
//#endregion
//#region src/template/empty-section.ts
var Eo = new Re("planEmptySection"), Q = j.filter((e) => e !== "plan-title"), Do = ".bn-block-group, .bn-block-outer, .bn-block", Oo = "button, input, textarea, select, a, [role='button']", ko = ":disabled, [aria-disabled='true']", Ao = ["section-panel", "section-actions"], jo = 1, Mo = S(({ editor: e }) => ({
	key: "planEmptySection",
	prosemirrorPlugins: [new w({
		key: Eo,
		props: No(e)
	})]
}))();
function No(e) {
	let t = (t) => bo(e, t);
	return {
		decorations: (n) => e.isEditable ? D.create(n.doc, lo(n.doc, t)) : D.empty,
		handleDOMEvents: { mousedown: Po },
		handleClickOn: $o,
		handleKeyDown: Ro,
		handlePaste: Lo
	};
}
function Po(e, t) {
	let n = e.editable && Io(e, t);
	return n && Qa(e), (n || qo(e, t.target)) && Fo(e, t) && $a(e), n;
}
function Fo(e, t) {
	return e.editable && t.button === jo;
}
function Io(e, t) {
	return Wo(e, t) || Go(e, t);
}
function Lo(e, t) {
	return e.editable && !Ho(t.target) && zo(e);
}
function Ro(e, t) {
	return wo(t) && !Ho(t.target) && zo(e);
}
function zo(e) {
	return Uo(e.state.selection) || Bo(e);
}
function Bo(e) {
	let t = Vo(e), n = t instanceof Element ? t : t?.parentElement;
	return n && e.dom.contains(n) ? Q.includes(Yo(n)) : !1;
}
function Vo({ root: e, dom: t }) {
	return (e.getSelection?.() ?? t.ownerDocument.getSelection())?.anchorNode;
}
function Ho(e) {
	let t = e instanceof Element ? e.closest(Oo) : null;
	return t !== null && !t.matches(ko);
}
function Uo(e) {
	if (!(e instanceof C)) return !1;
	let { type: t } = e.node;
	return Q.includes(t.name);
}
function Wo(e, t) {
	return !Xo(e, t.target) || !Zo(e, t) ? !1 : (t.preventDefault(), !0);
}
function Go(e, t) {
	return Ko(e, t.target) ? (t.preventDefault(), !0) : !1;
}
function Ko(e, t) {
	if (!(t instanceof Element) || !e.dom.contains(t)) return !1;
	let n = Yo(t);
	return Q.includes(n) && !Ho(t) && !(Ao.includes(n) && Jo(t));
}
function qo(e, t) {
	return t instanceof Element && e.dom.contains(t) && Q.includes(Yo(t));
}
function Jo(e) {
	return [...e.childNodes].some((e) => e instanceof Text && e.data.trim() !== "");
}
function Yo(e) {
	return e.closest(".bn-block-content")?.getAttribute("data-content-type") ?? "";
}
function Xo(e, t) {
	return t instanceof Element && (t === e.dom || t.matches(Do));
}
function Zo(e, t) {
	let n = ro(e.state.doc).filter((n) => Qo(e, n, t.clientY));
	return n.length > 0 && n.every((e) => Q.includes(e.type));
}
function Qo(e, { pos: t }, n) {
	let r = e.nodeDOM(t);
	if (!(r instanceof Element)) return !1;
	let { top: i, bottom: a } = r.getBoundingClientRect();
	return i <= n && n <= a;
}
function $o(...[e, , t]) {
	return e.editable && Q.includes(t.type.name);
}
//#endregion
//#region src/template/section-moves.ts
var es = {
	ArrowUp: "up",
	ArrowDown: "down"
}, ts = 3, ns = 2, rs = S({
	key: "planSectionMoves",
	prosemirrorPlugins: [new w({ props: { handleKeyDown: is } })]
});
function is(e, t) {
	let n = as(t);
	if (!n) return !1;
	let r = ro(e.state.doc), i = ss(e.state, r), a = i < 0 ? "one-step" : us(n, r, i);
	return typeof a == "number" && e.dispatch(hs(e.state, r[i], a)), a !== "one-step";
}
function as(e) {
	return os(e) && e.shiftKey && !e.altKey ? es[e.key] : void 0;
}
function os({ metaKey: e, ctrlKey: t }) {
	return xo ? e && !t : t && !e;
}
function ss(e, t) {
	let { selection: n } = e;
	return cs(n) ? t.findIndex(({ pos: e, node: t, type: r }) => e < n.from && n.to < e + t.nodeSize && !j.includes(r)) : -1;
}
function cs(e) {
	let { $from: t, $to: n } = e, r = ls(e);
	return t.depth <= r && n.depth <= r;
}
function ls(e) {
	return e instanceof C ? ns : e instanceof ze ? ts : -1;
}
function us(e, t, n) {
	return e === "down" ? fs(t, n) : ps(t, n);
}
var ds = [...f, m];
function fs(e, t) {
	let n = e.findIndex((e, n) => n > t && e.type === "section-heading"), r = e.slice(t + 1, n < 0 ? void 0 : n);
	if (r.length === 0 || !r.every((e) => ds.includes(e.type))) return "one-step";
	let i = e[n];
	return i ? i.pos + i.node.nodeSize : "nowhere";
}
function ps(e, t) {
	let n = e.slice(0, t).reverse(), r = n.find((e) => !f.includes(e.type));
	if (!r || r.type !== "section-heading") return "one-step";
	let i = n.filter((e) => e.pos < r.pos), a = i.find((e) => e.type === no);
	return a ? ms(i, a) ?? r.pos : "nowhere";
}
function ms(e, t) {
	return e[e.findIndex((e) => e === t || !ds.includes(e.type)) - 1]?.pos;
}
function hs(e, t, n) {
	let { tr: r, selection: i } = e;
	if (!t) return r;
	let { pos: a, node: o } = t;
	r.delete(a, a + o.nodeSize);
	let s = r.mapping.map(n);
	return r.insert(s, o), r.setSelection(gs(r.doc, i, s - a)).scrollIntoView();
}
function gs(e, t, n) {
	return t instanceof C ? C.create(e, t.from + n) : ze.create(e, t.anchor + n, t.head + n);
}
//#endregion
//#region src/use-plan-editor.ts
function _s({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = vs(e, n, i), s = bs(o, e, a((e) => r?.(Jt(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => Jt(s, t), [s, t]),
		hosts: i
	};
}
function vs(e, t, n) {
	let { doc: r } = e;
	return Me(ct({
		schema: ri,
		extensions: ys(r, n),
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Qi
		}
	}), [e]);
}
function ys(e, t) {
	return [
		wt,
		Mo,
		rs,
		Ga(e, t)
	];
}
function bs(e, t, n) {
	let [r, i] = d(() => et(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var xs = {};
function Ss({ transport: e, adapters: t = xs, className: n, ...r }) {
	let i = Ha(e), a = Cs(r);
	return /* @__PURE__ */ v(ut, {
		value: t,
		children: /* @__PURE__ */ v("div", {
			className: ws({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ v(Ts, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ v(Sa, { status: "connecting" })
		})
	});
}
function Cs({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function ws({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function Ts({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Ua(t.session);
	if (!r) return /* @__PURE__ */ v(Sa, {
		status: n,
		reason: i
	});
	let a = e ?? xe(r.type);
	return /* @__PURE__ */ y(R, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ v(Sa, {
			status: n,
			reason: i
		}), /* @__PURE__ */ v(Es, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Es({ validationPhase: e = "approval", onValidation: t, onRefine: n, onGeneratePrototype: r, ...i }) {
	let { session: a, user: o } = i, { editor: s, plan: c, hosts: l } = _s(i), u = Ds(a, s, l), d = Is(c, e, t);
	ia(s, a.awareness);
	let ee = {
		user: o,
		onRefine: n,
		onGeneratePrototype: r,
		doc: a.doc
	};
	return /* @__PURE__ */ v(dt, {
		value: ee,
		children: /* @__PURE__ */ v(Os, {
			...i,
			...u,
			...c,
			report: d
		})
	});
}
function Ds(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Os({ onRefineFailures: e, ...t }) {
	let n = As(t.sections), r = va(t.doc, n, e);
	return /* @__PURE__ */ y(tr, {
		value: n,
		children: [/* @__PURE__ */ v(Fs, { ...t }), /* @__PURE__ */ v(ks, {
			...t,
			titles: n,
			failed: r
		})]
	});
}
function ks({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ y("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ v(js, { ...n }), t && /* @__PURE__ */ v(Ms, { ...n })]
	});
}
function As(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function js({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ v(ua, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => ma(e, t.clientId)
	});
}
function Ms({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = Ps(r.sections);
	return /* @__PURE__ */ v(wi, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => Ns(e, t),
		children: n
	});
}
function Ns(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function Ps(e) {
	return l(() => ve(Se({ sections: e }), e.map((e) => e.slot)), [e]);
}
function Fs({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Ca(n, () => Ls(e));
	return /* @__PURE__ */ y(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ v(pi, {}),
			/* @__PURE__ */ v(zt, {}),
			/* @__PURE__ */ v(ft, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Is(e, t, n) {
	let r = l(() => Te(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Ls(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function Rs(e) {
	let t = Qe(e.blocks), n = new nt(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Bs(r), {
		doc: t,
		connect: () => Hs(r)
	};
}
function zs(e) {
	return Rs(e).connect();
}
function Bs(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Vs(t, n, {
		type: "update",
		update: E(e)
	})), r.on("update", (n, i) => {
		let a = it(r, e(n));
		Vs(t, i, {
			type: "awareness",
			update: E(a)
		});
	});
}
function Vs(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Hs(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Us(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Ws(e, n), () => t.handlers.delete(n))
	};
}
function Us(e, t, n) {
	if (n.type === "update") {
		ot(e.doc, T(n.update), t);
		return;
	}
	rt(e.awareness, T(n.update), t);
}
function Ws({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: E(st(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = it(t, i);
		r({
			type: "awareness",
			update: E(e)
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
}, Gs = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Ks({ before: e, after: t, className: n }) {
	let r = se(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ y("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ v("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ v(qs, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ v(Js, { section: e }, e.slot)),
			/* @__PURE__ */ v(Ys, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function qs({ changes: e }) {
	return /* @__PURE__ */ v("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ y("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function Js({ section: e }) {
	return /* @__PURE__ */ y("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ v("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ v("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ y("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ y("span", {
					"aria-hidden": "true",
					children: [Gs[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Ys({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ y("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ v("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ v("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ y("li", {
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
export { Ks as PlanDiffView, Ss as PlanEditor, Tt as bypassTemplate, Rs as createMemoryHub, qt as fromEditorBlocks, zs as localTransport, ri as planSchema, Jt as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map