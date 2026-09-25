import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as f, PLAN_FRAGMENT as ne, changeWords as re, diffPlans as ie, findSectionSlot as p, isRequiredAt as ae, newId as m, optionsOf as oe, parseBlock as se, previewProposal as ce, refineInputs as le, settledCount as ue, templateFor as de, toPlanDocument as fe, usesOf as pe, validatePlan as me } from "@re-cinq/planning-document";
import { createPortal as he } from "react-dom";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
import { offset as ge } from "@floating-ui/react";
import { SideMenuExtension as _e } from "@blocknote/core/extensions";
import { SideMenu as ve, SideMenuController as ye, SuggestionMenuController as be, createReactBlockSpec as v, useBlockNoteEditor as y, useCreateBlockNote as xe, useEditorChange as Se, useExtensionState as Ce } from "@blocknote/react";
import { BlockNoteSchema as we, createExtension as Te, filterSuggestionItems as Ee, insertOrUpdateBlockForSlashMenu as De } from "@blocknote/core";
import { Plugin as Oe, PluginKey as ke } from "prosemirror-state";
import { yCursorPluginKey as Ae, ySyncPluginKey as je } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as Me, acceptChange as Ne, acceptRefine as Pe, applyChangeAnyway as Fe, applyRefineAnyway as Ie, askRefine as Le, changesIn as Re, discardChange as ze, discardRefine as Be, docFromBlocks as Ve, fromBase64 as b, proposalsIn as He, readBlocks as Ue, staleChanges as We, toBase64 as x } from "@re-cinq/planning-yjs";
import { Awareness as Ge, applyAwarenessUpdate as Ke, encodeAwarenessUpdate as S } from "y-protocols/awareness";
import { Doc as qe, applyUpdate as C, encodeStateAsUpdate as Je } from "yjs";
import { withCollaboration as Ye } from "@blocknote/core/yjs";
import { Decoration as Xe, DecorationSet as Ze } from "prosemirror-view";
//#region src/blocks/adapters.ts
var Qe = n({}), $e = n({ user: {
	id: "",
	name: "Someone"
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
function et({ changes: e, hosts: t }) {
	return /* @__PURE__ */ g(h, { children: e.map((e) => /* @__PURE__ */ g(tt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function tt({ review: e, host: t }) {
	return t ? he(/* @__PURE__ */ g(nt, { review: e }), t) : null;
}
function nt({ review: e }) {
	return /* @__PURE__ */ _("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: T.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g(ot, { change: e.change }),
			e.stale && /* @__PURE__ */ g(rt, {}),
			/* @__PURE__ */ g(it, { review: e })
		]
	});
}
function rt() {
	return /* @__PURE__ */ g("p", {
		className: T.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function it({ review: e }) {
	return /* @__PURE__ */ _("p", {
		className: T.bar,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: E.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ g("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
var at = {
	"remove-block": "This paragraph goes.",
	"set-section-text": "This section is cleared.",
	"set-section-prose": "This section is cleared."
};
function ot({ change: e }) {
	let t = re(e), n = at[e.op.op];
	return t.length === 0 && n ? /* @__PURE__ */ g("p", {
		className: T.dropped,
		children: n
	}) : t.map((e, t) => /* @__PURE__ */ g("p", {
		className: T.words,
		children: e
	}, t));
}
//#endregion
//#region src/template/template-guard.ts
var st = "planTemplateBypass", ct = "section-heading", lt = "blockContent", ut = [
	"plan-title",
	ct,
	"section-panel",
	"section-actions"
], dt = Te({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Oe({ filterTransaction: pt })]
});
function ft(e, t) {
	return e.setMeta(st, t);
}
function pt(e, t) {
	if (!e.docChanged || mt(e)) return !0;
	let n = ht(t.doc), r = ht(e.doc);
	return bt(_t(n), _t(r)) && vt(n, r);
}
function mt(e) {
	let t = e.getMeta(je);
	return !!e.getMeta(st) || t?.isChangeOrigin === !0;
}
function ht(e) {
	let t = [];
	return e.descendants((e) => {
		gt(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function gt(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(lt);
}
function _t(e) {
	return e.filter((e) => ut.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function vt(e, t) {
	return yt(t) === 0 || yt(e) > 0;
}
function yt(e) {
	let t = e.findIndex((e) => e.type === ct);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function bt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var xt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [ge(({ elements: e, rects: t }) => {
		let n = wt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function St() {
	return /* @__PURE__ */ g(ye, {
		floatingUIOptions: xt,
		sideMenu: Ct
	});
}
function Ct() {
	let e = Ce(_e, { selector: (e) => e?.block.type });
	return e === void 0 || ut.includes(e) ? null : /* @__PURE__ */ g(ve, {});
}
function wt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Tt(t) : null;
}
function Tt(e) {
	let t = Et(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Et(e) {
	let t = Dt(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Ot(n);
}
function Dt(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Ot(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function kt(e) {
	return e;
}
function At(e) {
	return e.map(se);
}
function D(e, t) {
	return fe(At(e), t);
}
var O = {
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
}, jt = { props: { resolved: !0 } }, Mt = { props: { resolved: !1 } };
function Nt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = Kt(j(e));
	return /* @__PURE__ */ _("aside", {
		className: O.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${M(e)}`,
		...Ft({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ g(It, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ g("div", {
				className: O.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(Pt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Pt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: O.actions,
		contentEditable: !1,
		children: [A(e) && /* @__PURE__ */ g(Lt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ g(Rt, {
			block: e,
			editor: t
		})]
	});
}
function Ft({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function It({ block: e, resolved: t }) {
	return /* @__PURE__ */ _("p", {
		className: O.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("span", {
				className: O.author,
				children: M(e)
			}),
			/* @__PURE__ */ g("time", {
				className: O.when,
				children: Xt(e.props.at)
			}),
			t && /* @__PURE__ */ g("span", {
				className: O.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Lt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ g(k, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Mt)
	}) : /* @__PURE__ */ g(Ht, {
		block: e,
		editor: t
	});
}
function Rt({ block: e, editor: t }) {
	let [n, r] = d(!1), i = Vt(e);
	return /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g(k, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ g(zt, {
		question: Bt(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function zt({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ _("div", {
		className: O.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("p", {
				className: O.question,
				children: e
			}),
			/* @__PURE__ */ g(k, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ g(k, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function Bt(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function Vt(e) {
	let t = y();
	if (!A(e)) return [e];
	let n = j(e);
	return t.document.filter((e) => e.type === "comment" && j(e) === n);
}
function Ht({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ _(h, { children: [n ? /* @__PURE__ */ g(Ut, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ g(k, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ g(k, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, jt)
	})] });
}
function k({ label: e, onClick: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Ut({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = Gt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ g("form", {
		className: O.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ g(Wt, {
			to: M(e),
			draft: r,
			onDraft: i
		})
	});
}
function Wt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ g("input", {
		className: O.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function Gt({ editor: e, block: t }) {
	let { user: n } = w(), r = y();
	return (i) => {
		if (!i) return;
		let a = j(t), o = r.document, s = Jt(o, a) ?? t;
		e.insertBlocks([Yt(a, i, n.name)], s, "after");
	};
}
function Kt(e) {
	let t = y(), n = () => qt(t.document, e), [r, i] = d(n);
	return Se(() => i(n())), r;
}
function qt(e, t) {
	return e.some((e) => A(e) && j(e) === t && e.props.resolved === !0);
}
function Jt(e, t) {
	return e.filter((e) => e.type === "comment" && j(e) === t).at(-1);
}
function A(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function j(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function M(e) {
	return String(e.props.author || "Someone");
}
function Yt(e, t, n) {
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
function Xt(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var N = {
	finding: "_finding_d6sjh_1",
	who: "_who_d6sjh_24",
	label: "_label_d6sjh_37",
	why: "_why_d6sjh_41",
	text: "_text_d6sjh_45",
	actions: "_actions_d6sjh_59"
};
//#endregion
//#region src/blocks/FindingView.tsx
function Zt({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ _("aside", {
		className: N.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": en(r),
		children: [
			/* @__PURE__ */ g(Qt, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ g("div", {
				className: N.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g($t, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Qt({ severity: e, why: t }) {
	return /* @__PURE__ */ _("p", {
		className: N.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("span", {
			className: N.label,
			children: en(e)
		}), t && /* @__PURE__ */ g("span", {
			className: N.why,
			children: t
		})]
	});
}
function $t({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: N.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ g("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function en(e) {
	return `Finding · ${e}`;
}
var P = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function tn({ block: e }) {
	let { renderMockup: t } = o(Qe);
	return /* @__PURE__ */ _("figure", {
		className: P.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ _("figcaption", {
			className: P.label,
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
var nn = {
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
}, F = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, rn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function an({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: F.steps,
		disabled: r
	};
	return /* @__PURE__ */ _("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ g("legend", {
			className: F.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ g(on, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function on({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ _("label", {
		className: F.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ g("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), rn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var sn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function cn(e, t) {
	return e[String(t)] ?? String(t);
}
var I = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function ln({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ _("span", {
		className: I.field,
		"data-field": e,
		children: [/* @__PURE__ */ g("label", {
			className: I.label,
			htmlFor: n,
			children: cn(sn, e)
		}), /* @__PURE__ */ g(un, {
			...t,
			id: n
		})]
	});
}
function un(e) {
	return e.spec.values ? /* @__PURE__ */ g(dn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ g(fn, { ...e });
}
function dn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ g("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ g("option", { children: e }, e))
	});
}
function fn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ g("input", {
		id: e,
		className: I.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var pn = { maturity: an };
function mn({ block: e, editor: t, contentRef: n }) {
	let r = nn[e.type];
	return /* @__PURE__ */ _("div", {
		className: P.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ g(hn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ g("div", {
			className: P.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function hn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ _("div", {
		className: P.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("p", {
			className: P.head,
			children: [/* @__PURE__ */ g("span", {
				className: P.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ g(gn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ g(_n, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function gn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ _("a", {
		className: P.link,
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
function _n({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = f[e.type], o = a;
	return r(pn[n] ?? ln, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var vn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function yn({ contentRef: e }) {
	return /* @__PURE__ */ g("h1", {
		className: vn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var L = {
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
function bn({ block: e, editor: t, contentRef: n }) {
	let r = oe(e.props.options);
	return /* @__PURE__ */ _("div", {
		className: L.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ g(xn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ g("div", {
				className: L.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ g(Sn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function xn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ g("p", {
		className: L.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ g("span", {
			className: L.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ _("p", {
		className: L.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("span", {
				className: L.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ g("span", {
				className: L.why,
				children: e
			}),
			/* @__PURE__ */ g("span", {
				className: L.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Sn({ block: e, editor: t, options: n }) {
	return On(An(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ g(Cn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ g(Tn, {
		block: e,
		editor: t
	});
}
function Cn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ g("ul", {
		className: L.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(wn, {
			onPick: () => Dn(t, e, n),
			children: n
		}) }, n))
	});
}
function wn({ onPick: e, children: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: L.suggestion,
		onClick: e,
		children: t
	});
}
function Tn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ _("form", {
		className: L.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Dn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ g(En, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ g("button", {
			type: "submit",
			className: L.answerButton,
			children: "Answer"
		})]
	});
}
function En({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ g("input", {
		className: L.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Dn(e, t, n) {
	if (!n) return;
	let r = An(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function On(e) {
	let t = y(), [n, r] = d(() => kn(t.document, e));
	return Se(() => r(kn(t.document, e))), n;
}
function kn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function An(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var R = n(null), jn = n(/* @__PURE__ */ new Map());
function z(e) {
	let t = o(R), n = o(jn).get(e);
	return t ? p(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var B = /* @__PURE__ */ new WeakMap();
function Mn(e, t) {
	let n = Pn(e);
	return l(() => {
		let n = Fn(e), r = le(n, t), i = He(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ue(r),
			proposal: i,
			preview: i?.status === "proposed" ? ce(n, i) : void 0,
			...Nn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Nn(e, t, n) {
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
function Pn(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function Fn(e) {
	let t = B.get(e);
	if (t) return t;
	let n = Ue(e);
	return B.set(e, n), e.once("update", () => B.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function In(e) {
	let t = Mn(e.doc, e.slot), n = Rn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal ? /* @__PURE__ */ g(Ln, {
		...r,
		proposal: t.proposal
	}) : /* @__PURE__ */ g(zn, { ...r });
}
function Ln({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ g(Bn, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ g(Vn, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ g(Hn, {
			...t,
			proposal: e
		});
	}
}
function Rn({ slot: e, title: t }, n) {
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
function zn({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ _("p", {
		className: E.bar,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: E.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ g("span", {
			className: E.note,
			children: n ? `uses ${Kn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Bn({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ _("p", {
		className: E.bar,
		role: "status",
		children: [/* @__PURE__ */ _("span", {
			className: E.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ g("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Vn({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ _("section", {
		className: E.proposal,
		children: [/* @__PURE__ */ _("p", {
			className: E.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ _("p", {
			className: E.bar,
			children: [/* @__PURE__ */ g("button", {
				type: "button",
				className: E.refine,
				onClick: t,
				children: "Ask again"
			}), /* @__PURE__ */ g(V, {
				label: "Dismiss",
				run: e.discard
			})]
		})]
	});
}
function Hn({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ _("section", {
		className: E.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ _("p", {
				className: E.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					qn(r)
				]
			}),
			/* @__PURE__ */ g(Wn, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ _("p", {
				className: E.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ g(Un, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function Un({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ _("p", {
		className: E.bar,
		children: [
			/* @__PURE__ */ g("button", {
				type: "button",
				className: E.refine,
				onClick: i,
				children: r
			}),
			n && /* @__PURE__ */ g(V, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ g(V, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function V({ label: e, run: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: E.quiet,
		onClick: t,
		children: e
	});
}
function Wn({ lines: e }) {
	return /* @__PURE__ */ g("ul", {
		className: E.lines,
		children: e.map((e, t) => /* @__PURE__ */ g("li", {
			className: E[e.kind],
			children: /* @__PURE__ */ g(Gn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function Gn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ g("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ g("del", { children: e.text }) : e.text;
}
function Kn({ inputs: e }) {
	return Jn(e.answered.length, e.resolved.length);
}
function qn({ uses: e }) {
	let t = Jn(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Jn(e, t) {
	return [Yn(e, "answer"), Yn(t, "resolved thread")].filter(Boolean).join(", ");
}
function Yn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var Xn = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function Zn({ block: e, editor: t }) {
	let { slot: n, title: r } = Qn(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ g("div", {
		role: "group",
		className: Xn.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(In, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function Qn(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: z(t)?.title ?? t
	};
}
var H = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function $n({ block: e }) {
	let t = z(e.props.slot);
	return /* @__PURE__ */ _("header", {
		className: H.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("h2", {
			className: H.title,
			children: e.props.title
		}), t && /* @__PURE__ */ g("p", {
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
function er({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = z(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ g("aside", {
		className: U.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(tr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function tr({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = d("");
	return /* @__PURE__ */ _("form", {
		className: U.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(rr({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ g("input", {
			className: U.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ g(nr, {})]
	});
}
function nr() {
	return /* @__PURE__ */ g("button", {
		type: "submit",
		className: U.send,
		children: "Comment"
	});
}
function rr({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([ir(n, r)], e, "before"), "");
}
function ir(e, t) {
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
var W = { render: mn }, ar = {
	"plan-title": v(f["plan-title"], { render: yn })(),
	"section-heading": v(f["section-heading"], { render: $n })(),
	"section-panel": v(f["section-panel"], { render: er })(),
	"section-actions": v(f["section-actions"], { render: Zn })(),
	comment: v(f.comment, { render: Nt })(),
	finding: v(f.finding, { render: Zt })(),
	kpi: v(f.kpi, W)(),
	prototype: v(f.prototype, W)(),
	mockup: v(f.mockup, { render: tn })(),
	question: v(f.question, { render: bn })(),
	answer: v(f.answer, W)()
}, G = we.create({ blockSpecs: {
	...Me,
	...ar
} });
//#endregion
//#region src/menu/section-context.ts
function or(e, t) {
	let [n] = cr(e, t);
	return n ? String(n.props.slot) : null;
}
function sr(e, t) {
	let n = cr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function cr(e, t) {
	let n = e.slice(0, lr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function lr(e, t) {
	return e.findIndex((e) => ur(e, t));
}
function ur(e, t) {
	return e.id === t || e.children.some((e) => ur(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", dr = { cells: [
	"",
	"",
	""
] }, fr = [
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
			rows: [dr, dr]
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
			let t = sr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function pr(e, t) {
	return fr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => mr(e, t));
}
function mr(e, t) {
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
function hr() {
	let e = y(G), t = o(R);
	return /* @__PURE__ */ g(be, {
		triggerCharacter: "/",
		getItems: async (n) => Ee(gr(e, t), n)
	});
}
function gr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && _r(t, i);
	return a ? pr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => De(e, kt(t))
	})) : [];
}
function _r(e, { blocks: t, cursorId: n }) {
	let r = or(t, n);
	return r === null ? void 0 : p(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function vr(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => yr(e, t, n));
}
function yr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ae(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function br(e) {
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
}, xr = [];
function Sr({ template: e, report: t, sections: n = xr, approval: r = null, children: i }) {
	return /* @__PURE__ */ _("nav", {
		className: J.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ g("p", {
				className: J.phase,
				children: r ? wr(r) : Cr(t)
			}),
			/* @__PURE__ */ g(Er, {
				template: e,
				report: t,
				sections: n
			}),
			i && /* @__PURE__ */ g("div", {
				className: J.footer,
				children: i
			})
		]
	});
}
function Cr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function wr({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Tr(t)}`;
}
function Tr(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Er({ template: e, report: t, sections: n }) {
	let r = br(t.problems);
	return /* @__PURE__ */ g("ol", {
		className: J.slots,
		children: vr(e, n, t.phase).map((e) => /* @__PURE__ */ g(Dr, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Dr({ section: e, problems: t }) {
	return /* @__PURE__ */ _("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ g("span", {
				className: J.title,
				children: e.title
			}),
			e.required && /* @__PURE__ */ g("span", {
				className: J.required,
				children: " required"
			}),
			/* @__PURE__ */ g("ul", {
				className: J.problems,
				children: t.map((e) => /* @__PURE__ */ g("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var Y = {
	editor: "_editor_1495q_1",
	withSidebar: "_withSidebar_1495q_9",
	single: "_single_1495q_13",
	sidebar: "_sidebar_1495q_22"
}, X = {
	participants: "_participants_64cvt_1",
	locate: "_locate_64cvt_16",
	away: "_away_64cvt_17",
	dot: "_dot_64cvt_38"
}, Z = /* @__PURE__ */ "#c32222.#278643.#9213ec.#827517.#287a8a.#e21283.#338618.#2c288a.#cb4f10.#18865d.#82288a.#677f0a.#2272c3.#8a283c.#0b8916.#5f22c3.#8a6a28.#0b847f.#c3229b.#508226.#1337ec.#c33722.#27864f.#ad13ec.#797915.#286d8a.#e21268.#258618.#39288a.#b85d0f.#18866b.#8a2886.#587f0a.#225ec3.#8a2830.#0b8926.#7422c3.#867327.#0b828e.#c32286.#448226.#131bec.#c34b22.#27865b.#c513e7.#6c7915.#28618a.#e7134f.#188618.#45288a".split(".");
function Or(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(kr)) t.has(n.userId) || t.set(n.userId, jr(n.color, [...t.values()]));
	return t;
}
function kr(e, t) {
	return Number(Ar(t)) - Number(Ar(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Ar({ color: e }) {
	return e !== void 0 && Z.includes(e);
}
function jr(e, t) {
	let n = Z.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? Z[t.length % Z.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Mr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Nr(e, n)]);
}
function Nr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Q(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? Z[0]),
		slot: Lr(n),
		hasCursor: r != null
	};
}
function Pr(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Fr(e, t)] : []);
}
function Fr(e, t) {
	return {
		clientId: e,
		userId: Q(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Ir(e, t) {
	let n = e.get(t)?.user, r = n && Or(Pr(e)).get(Q(t, n));
	return r === n?.color ? void 0 : r;
}
function Q(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Lr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Rr(e, t, n) {
	let r = e.slot && p(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var zr = "⁠";
function Br(e) {
	let t = `background-color: var(${Hr(e.id ?? "")}, ${e.color}); color: white`, n = Wr("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Wr("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Wr("bn-collaboration-cursor__base");
	return i.append(zr, r, zr), i;
}
function Vr(e, t) {
	t.forEach((t) => e.style.setProperty(Hr(t.id), t.color));
}
function Hr(e) {
	return `--ps-peer-${[...e].map(Ur).join("")}`;
}
function Ur(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Wr(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function Gr(e) {
	let [t, n] = d(() => Zr(e));
	return Yr(e, () => n(Zr(e))), t;
}
function Kr(e, t) {
	Xr(e, t), qr(t), Jr(e, t);
}
function qr(e) {
	Yr(e, () => {
		let t = Ir(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function Jr(e, t) {
	Yr(t, () => {
		let n = e.domElement;
		n && Vr(n, Zr(t));
	});
}
function Yr(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function Xr(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: or(r, n.id) });
	}), [e, t]);
}
function Zr(e) {
	return Mr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function Qr({ awareness: e, ...t }) {
	let n = Gr(e);
	return n.length === 0 ? null : /* @__PURE__ */ g("ul", {
		className: X.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g($r, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function $r({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Rr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ g("button", {
		type: "button",
		className: X.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: ei,
		onClick: () => r(e),
		children: /* @__PURE__ */ g(ti, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ g("span", {
		className: X.away,
		children: /* @__PURE__ */ g(ti, {
			color: e.color,
			label: i
		})
	});
}
function ei(e) {
	e.preventDefault();
}
function ti({ color: e, label: t }) {
	return /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("svg", {
		className: X.dot,
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
function ni(e, t) {
	let n = e.prosemirrorView, r = ri(n, t);
	r !== null && ii(n, r)?.scrollIntoView({ block: "center" });
}
function ri(e, t) {
	let [n] = Ae.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function ii(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var ai = { notice: "_notice_1xdcv_1" }, oi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function si({ status: e, reason: t }) {
	return /* @__PURE__ */ _("p", {
		className: ai.notice,
		role: "status",
		"data-status": e,
		children: [oi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function ci(e, t) {
	let n = ui(e, t);
	return l(() => li(e), [e, n]);
}
function li(e) {
	let t = new Set(We(e).map((e) => e.changeId));
	return Re(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Fe(e, n.changeId) : Ne(e, n.changeId),
		discard: () => ze(e, n.changeId)
	}));
}
function ui(e, t) {
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
var di = "plan-transport", fi = class extends Ge {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function pi(e) {
	let t = new qe(), n = {
		doc: t,
		awareness: new fi(t)
	}, r = hi({
		status: "connecting",
		meta: null
	});
	vi(n, e);
	let i = e.subscribe((e) => _i({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => mi(n, i)
	};
}
function mi({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function hi(e) {
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
var gi = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		C(e, b(n), di), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => C(e, b(t), di),
	awareness: ({ awareness: e }, { update: t }) => Ke(e, b(t), di),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function _i(e, t) {
	gi[t.type](e, t);
}
function vi({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: x(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = S(n, e(t));
		r.send({
			type: "awareness",
			update: x(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function yi(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = pi(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function bi(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var xi = new ke("planChangeWidgets");
function Si(e, t) {
	return Te({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new Oe({
			key: xi,
			props: { decorations: (n) => Ze.create(n.doc, Ci(n, e, t)) }
		})]
	});
}
function Ci(e, t, n) {
	let r = Di(e);
	return Re(t).flatMap((e) => {
		let t = wi(r, e);
		return t === void 0 ? [] : [Ti(t, e, n)];
	});
}
function wi(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ti(e, t, n) {
	return Xe.widget(e, () => Ei(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Ei(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Di(e) {
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
function Oi({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = ki(e, n, i), s = Ai(o, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => D(s, t), [s, t]),
		hosts: i
	};
}
function ki(e, t, n) {
	let { doc: r } = e;
	return xe(Ye({
		schema: G,
		extensions: [dt, Si(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(ne),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: Br
		}
	}), [e]);
}
function Ai(e, t, n) {
	let [r, i] = d(() => Ue(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var ji = {};
function Mi({ transport: e, adapters: t = ji, className: n, ...r }) {
	let i = yi(e), a = Ni(r);
	return /* @__PURE__ */ g(Qe, {
		value: t,
		children: /* @__PURE__ */ g("div", {
			className: Pi({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ g(Fi, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ g(si, { status: "connecting" })
		})
	});
}
function Ni({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function Pi({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? Y.withSidebar : Y.single;
	return [
		Y.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function Fi({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = bi(t.session);
	if (!r) return /* @__PURE__ */ g(si, {
		status: n,
		reason: i
	});
	let a = e ?? de(r.type);
	return /* @__PURE__ */ _(R, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ g(si, {
			status: n,
			reason: i
		}), /* @__PURE__ */ g(Ii, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Ii({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = Oi(r), l = Li(i, o, c), u = Wi(s, e, t);
	return Kr(o, i.awareness), /* @__PURE__ */ g($e, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ g(Ri, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function Li(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Ri(e) {
	let t = Bi(e.sections);
	return /* @__PURE__ */ _(jn, {
		value: t,
		children: [/* @__PURE__ */ g(Ui, { ...e }), /* @__PURE__ */ g(zi, {
			...e,
			titles: t
		})]
	});
}
function zi({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ _("aside", {
		className: Y.sidebar,
		children: [e && /* @__PURE__ */ g(Vi, { ...n }), t && /* @__PURE__ */ g(Hi, { ...n })]
	});
}
function Bi(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function Vi({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ g(Qr, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => ni(e, t.clientId)
	});
}
function Hi({ meta: e, outlineFooter: t, ...n }) {
	return /* @__PURE__ */ g(Sr, {
		...n,
		approval: e.approval,
		children: t
	});
}
function Ui({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = ci(n, () => Gi(e));
	return /* @__PURE__ */ _(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ g(hr, {}),
			/* @__PURE__ */ g(St, {}),
			/* @__PURE__ */ g(et, {
				changes: i,
				hosts: r
			})
		]
	});
}
function Wi(e, t, n) {
	let r = l(() => me(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function Gi(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function Ki(e) {
	let t = Ve(e.blocks), n = new Ge(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Ji(r), {
		doc: t,
		connect: () => Xi(r)
	};
}
function qi(e) {
	return Ki(e).connect();
}
function Ji(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Yi(t, n, {
		type: "update",
		update: x(e)
	})), r.on("update", (n, i) => {
		let a = S(r, e(n));
		Yi(t, i, {
			type: "awareness",
			update: x(a)
		});
	});
}
function Yi(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Xi(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Zi(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Qi(e, n), () => t.handlers.delete(n))
	};
}
function Zi(e, t, n) {
	if (n.type === "update") {
		C(e.doc, b(n.update), t);
		return;
	}
	Ke(e.awareness, b(n.update), t);
}
function Qi({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: x(Je(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = S(t, i);
		r({
			type: "awareness",
			update: x(e)
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
}, $i = {
	kept: " ",
	added: "+",
	removed: "-"
};
function ea({ before: e, after: t, className: n }) {
	let r = ie(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ g(ta, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ g(na, { section: e }, e.slot)),
			/* @__PURE__ */ g(ra, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function ta({ changes: e }) {
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
function na({ section: e }) {
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
					children: [$i[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function ra({ what: e, changes: t }) {
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
export { ea as PlanDiffView, Mi as PlanEditor, ft as bypassTemplate, Ki as createMemoryHub, At as fromEditorBlocks, qi as localTransport, G as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map