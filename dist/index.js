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
var ct = "planTemplateBypass", E = "section-heading", lt = "blockContent", ut = [
	"plan-title",
	E,
	"section-panel",
	"section-actions"
], dt = Ee({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new ke({ filterTransaction: pt })]
});
function ft(e, t) {
	return e.setMeta(ct, t);
}
function pt(e, t) {
	if (!e.docChanged || mt(e)) return !0;
	let n = ht(t.doc), r = ht(e.doc);
	return bt(_t(n), _t(r)) && vt(n, r);
}
function mt(e) {
	let t = e.getMeta(Me);
	return !!e.getMeta(ct) || t?.isChangeOrigin === !0;
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
	let t = e.findIndex((e) => e.type === E);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function bt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var xt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [_e(({ elements: e, rects: t }) => {
		let n = wt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function St() {
	return /* @__PURE__ */ h(be, {
		floatingUIOptions: xt,
		sideMenu: Ct
	});
}
function Ct() {
	let e = we(ve, { selector: (e) => e?.block.type });
	return e === void 0 || ut.includes(e) ? null : /* @__PURE__ */ h(ye, {});
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
	return e.map(ce);
}
function D(e, t) {
	return pe(At(e), t);
}
var O = {
	comment: "_comment_1s8du_1",
	text: "_text_1s8du_23",
	who: "_who_1s8du_27",
	author: "_author_1s8du_36",
	when: "_when_1s8du_40",
	badge: "_badge_1s8du_44",
	actions: "_actions_1s8du_54",
	reply: "_reply_1s8du_78",
	confirm: "_confirm_1s8du_82",
	question: "_question_1s8du_94",
	input: "_input_1s8du_100"
}, jt = { props: { resolved: !0 } }, Mt = { props: { resolved: !1 } };
function Nt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = Kt(j(e));
	return /* @__PURE__ */ g("aside", {
		className: O.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${M(e)}`,
		...Ft({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ h(It, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ h("div", {
				className: O.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ h(Pt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Pt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: O.actions,
		contentEditable: !1,
		children: [A(e) && /* @__PURE__ */ h(Lt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ h(Rt, {
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
	return /* @__PURE__ */ g("p", {
		className: O.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: O.author,
				children: M(e)
			}),
			/* @__PURE__ */ h("time", {
				className: O.when,
				children: Xt(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: O.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Lt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ h(k, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Mt)
	}) : /* @__PURE__ */ h(Ht, {
		block: e,
		editor: t
	});
}
function Rt({ block: e, editor: t }) {
	let [n, r] = u(!1), i = Vt(e);
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h(k, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ h(zt, {
		question: Bt(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function zt({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ g("div", {
		className: O.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("p", {
				className: O.question,
				children: e
			}),
			/* @__PURE__ */ h(k, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ h(k, {
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
	let t = v();
	if (!A(e)) return [e];
	let n = j(e);
	return t.document.filter((e) => e.type === "comment" && j(e) === n);
}
function Ht({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ g(m, { children: [n ? /* @__PURE__ */ h(Ut, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(k, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(k, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, jt)
	})] });
}
function k({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Ut({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = Gt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: O.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h(Wt, {
			to: M(e),
			draft: r,
			onDraft: i
		})
	});
}
function Wt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: O.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function Gt({ editor: e, block: t }) {
	let { user: n } = C(), r = v();
	return (i) => {
		if (!i) return;
		let a = j(t), o = r.document, s = Jt(o, a) ?? t;
		e.insertBlocks([Yt(a, i, n.name)], s, "after");
	};
}
function Kt(e) {
	let t = v(), n = () => qt(t.document, e), [r, i] = u(n);
	return Ce(() => i(n())), r;
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
			commentId: p("cmt"),
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
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function Zt({ block: e }) {
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
var Qt = {
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
}, $t = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function en({ spec: e, value: t, onChange: n, readOnly: r }) {
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
		}), a.map((e, t) => /* @__PURE__ */ h(tn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function tn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ g("label", {
		className: P.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ h("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), $t[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var nn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function rn(e, t) {
	return e[String(t)] ?? String(t);
}
var F = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function an({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ g("span", {
		className: F.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: F.label,
			htmlFor: n,
			children: rn(nn, e)
		}), /* @__PURE__ */ h(on, {
			...t,
			id: n
		})]
	});
}
function on(e) {
	return e.spec.values ? /* @__PURE__ */ h(sn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ h(cn, { ...e });
}
function sn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ h("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ h("option", { children: e }, e))
	});
}
function cn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
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
var ln = { maturity: en };
function un({ block: e, editor: t, contentRef: n }) {
	let r = Qt[e.type];
	return /* @__PURE__ */ g("div", {
		className: N.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(dn, {
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
function dn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: N.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: N.head,
			children: [/* @__PURE__ */ h("span", {
				className: N.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ h(fn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ h(pn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function fn({ view: e, props: t }) {
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
function pn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(ln[n] ?? an, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var mn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function hn({ contentRef: e }) {
	return /* @__PURE__ */ h("h1", {
		className: mn.title,
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
function gn({ block: e, editor: t, contentRef: n }) {
	let r = se(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: I.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(_n, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: I.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ h(vn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function _n({ why: e, picks: t, used: n }) {
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
function vn({ block: e, editor: t, options: n }) {
	return wn(En(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(yn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ h(xn, {
		block: e,
		editor: t
	});
}
function yn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ h("ul", {
		className: I.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(bn, {
			onPick: () => Cn(t, e, n),
			children: n
		}) }, n))
	});
}
function bn({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: I.suggestion,
		onClick: e,
		children: t
	});
}
function xn({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ g("form", {
		className: I.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Cn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(Sn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: I.answerButton,
			children: "Answer"
		})]
	});
}
function Sn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
		className: I.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Cn(e, t, n) {
	if (!n) return;
	let r = En(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function wn(e) {
	let t = v(), [n, r] = u(() => Tn(t.document, e));
	return Ce(() => r(Tn(t.document, e))), n;
}
function Tn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function En(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var L = n(null), Dn = n(/* @__PURE__ */ new Map());
function R(e) {
	let t = o(L), n = o(Dn).get(e);
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var z = /* @__PURE__ */ new WeakMap();
function On(e, t) {
	let n = An(e);
	return l(() => {
		let n = jn(e), r = ue(n, t), i = Ue(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: de(r),
			proposal: i,
			preview: i?.status === "proposed" ? le(n, i) : void 0,
			...kn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function kn(e, t, n) {
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
function An(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function jn(e) {
	let t = z.get(e);
	if (t) return t;
	let n = We(e);
	return z.set(e, n), e.once("update", () => z.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Mn(e) {
	let t = On(e.doc, e.slot), n = Pn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal ? /* @__PURE__ */ h(Nn, {
		...r,
		proposal: t.proposal
	}) : /* @__PURE__ */ h(Fn, { ...r });
}
function Nn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ h(In, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ h(Ln, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ h(Rn, {
			...t,
			proposal: e
		});
	}
}
function Pn({ slot: e, title: t }, n) {
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
function Fn({ refine: e, ask: t }) {
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
			children: n ? `uses ${Hn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function In({ refine: e, askedBy: t }) {
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
function Ln({ refine: e, ask: t, reason: n }) {
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
function Rn({ refine: e, ask: t, title: n, proposal: r }) {
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
					Un(r)
				]
			}),
			/* @__PURE__ */ h(Bn, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ h(zn, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function zn({ refine: e, ask: t, stale: n }) {
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
function Bn({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: T.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: T[e.kind],
			children: /* @__PURE__ */ h(Vn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function Vn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
}
function Hn({ inputs: e }) {
	return Wn(e.answered.length, e.resolved.length);
}
function Un({ uses: e }) {
	let t = Wn(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Wn(e, t) {
	return [Gn(e, "answer"), Gn(t, "resolved thread")].filter(Boolean).join(", ");
}
function Gn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var Kn = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function qn({ block: e, editor: t }) {
	let { slot: n, title: r } = Jn(e), { onRefine: i, doc: a } = C();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: Kn.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Mn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function Jn(e) {
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
function Yn({ block: e }) {
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
function Xn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = R(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Zn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function Zn({ block: e, editor: t, title: n }) {
	let { user: r } = C(), [i, a] = u("");
	return /* @__PURE__ */ g("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a($n({
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
		}), /* @__PURE__ */ h(Qn, {})]
	});
}
function Qn() {
	return /* @__PURE__ */ h("button", {
		type: "submit",
		className: H.send,
		children: "Comment"
	});
}
function $n({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([er(n, r)], e, "before"), "");
}
function er(e, t) {
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
var U = { render: un }, tr = {
	"plan-title": _(d["plan-title"], { render: hn })(),
	"section-heading": _(d["section-heading"], { render: Yn })(),
	"section-panel": _(d["section-panel"], { render: Xn })(),
	"section-actions": _(d["section-actions"], { render: qn })(),
	comment: _(d.comment, { render: Nt })(),
	kpi: _(d.kpi, U)(),
	prototype: _(d.prototype, U)(),
	mockup: _(d.mockup, { render: Zt })(),
	question: _(d.question, { render: gn })(),
	answer: _(d.answer, U)()
}, W = Te.create({ blockSpecs: {
	...Ne,
	...tr
} });
//#endregion
//#region src/menu/section-context.ts
function nr(e, t) {
	let [n] = ir(e, t);
	return n ? String(n.props.slot) : null;
}
function rr(e, t) {
	let n = ir(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function ir(e, t) {
	let n = e.slice(0, ar(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function ar(e, t) {
	return e.findIndex((e) => or(e, t));
}
function or(e, t) {
	return e.id === t || e.children.some((e) => or(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", sr = { cells: [
	"",
	"",
	""
] }, cr = [
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
			rows: [sr, sr]
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
			let t = rr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function lr(e, t) {
	return cr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => ur(e, t));
}
function ur(e, t) {
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
function dr() {
	let e = v(W), t = o(L);
	return /* @__PURE__ */ h(xe, {
		triggerCharacter: "/",
		getItems: async (n) => De(fr(e, t), n)
	});
}
function fr(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && pr(t, i);
	return a ? lr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Oe(e, kt(t))
	})) : [];
}
function pr(e, { blocks: t, cursorId: n }) {
	let r = nr(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function mr(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => hr(e, t, n));
}
function hr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && oe(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function gr(e) {
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
}, _r = [];
function vr({ template: e, report: t, sections: n = _r, approval: r = null, children: i }) {
	return /* @__PURE__ */ g("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ h("p", {
				className: q.phase,
				children: r ? br(r) : yr(t)
			}),
			/* @__PURE__ */ h(Sr, {
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
function yr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function br({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${xr(t)}`;
}
function xr(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Sr({ template: e, report: t, sections: n }) {
	let r = gr(t.problems);
	return /* @__PURE__ */ h("ol", {
		className: q.slots,
		children: mr(e, n, t.phase).map((e) => /* @__PURE__ */ h(Cr, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Cr({ section: e, problems: t }) {
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
function wr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Tr(e, n)]);
}
function Tr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: Er(n),
		hasCursor: r != null
	};
}
function Er(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Dr(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function Or(e) {
	let [t, n] = u(() => Ar(e));
	return s(() => {
		let t = () => n(Ar(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function kr(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: nr(r, n.id) });
	}), [e, t]);
}
function Ar(e) {
	return wr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function jr({ awareness: e, ...t }) {
	let n = Or(e);
	return n.length === 0 ? null : /* @__PURE__ */ h("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(Mr, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function Mr({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Dr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ h("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: Nr,
		onClick: () => r(e),
		children: /* @__PURE__ */ h(X, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ h("span", {
		className: Y.away,
		children: /* @__PURE__ */ h(X, {
			color: e.color,
			label: i
		})
	});
}
function Nr(e) {
	e.preventDefault();
}
function X({ color: e, label: t }) {
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
function Pr(e, t) {
	let n = e.prosemirrorView, r = Fr(n, t);
	r !== null && Ir(n, r)?.scrollIntoView({ block: "center" });
}
function Fr(e, t) {
	let [n] = je.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Ir(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Lr = { notice: "_notice_1xdcv_1" }, Rr = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: Lr.notice,
		role: "status",
		"data-status": e,
		children: [Rr[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function zr(e, t) {
	let n = Vr(e, t);
	return l(() => Br(e), [e, n]);
}
function Br(e) {
	let t = new Set(Ge(e).map((e) => e.changeId));
	return ze(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Ie(e, n.changeId) : Pe(e, n.changeId),
		discard: () => Be(e, n.changeId)
	}));
}
function Vr(e, t) {
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
function Hr(e) {
	let t = new Je(), n = {
		doc: t,
		awareness: new Ke(t)
	}, r = Wr({
		status: "connecting",
		meta: null
	});
	qr(n, e);
	let i = e.subscribe((e) => Kr({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Ur(n, i)
	};
}
function Ur({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Wr(e) {
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
var Gr = {
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
function Kr(e, t) {
	Gr[t.type](e, t);
}
function qr({ doc: t, awareness: n }, r) {
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
function Jr(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = Hr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Yr(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Xr = new Ae("planChangeWidgets");
function Zr(e, t) {
	return Ee({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new ke({
			key: Xr,
			props: { decorations: (n) => Qe.create(n.doc, Qr(n, e, t)) }
		})]
	});
}
function Qr(e, t, n) {
	let r = ni(e);
	return ze(t).flatMap((e) => {
		let t = $r(r, e);
		return t === void 0 ? [] : [ei(t, e, n)];
	});
}
function $r(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function ei(e, t, n) {
	return Ze.widget(e, () => ti(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function ti(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function ni(e) {
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
function ri({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = ii(e, n, i), s = ai(o, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => D(s, t), [s, t]),
		hosts: i
	};
}
function ii(e, t, n) {
	let { doc: r } = e;
	return Se(Xe({
		schema: W,
		extensions: [dt, Zr(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function ai(e, t, n) {
	let [r, i] = u(() => We(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var oi = {};
function si({ transport: e, adapters: t = oi, className: n, ...r }) {
	let i = Jr(e), a = ci(r);
	return /* @__PURE__ */ h($e, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: li({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ h(ui, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ h(Z, { status: "connecting" })
		})
	});
}
function ci({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function li({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ui({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Yr(t.session);
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
		}), /* @__PURE__ */ h(di, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function di({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = ri(r), l = fi(i, o, c), ee = yi(s, e, t);
	return kr(o, i.awareness), /* @__PURE__ */ h(et, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(pi, {
			...r,
			...l,
			...s,
			report: ee
		})
	});
}
function fi(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function pi(e) {
	let t = hi(e.sections);
	return /* @__PURE__ */ g(Dn, {
		value: t,
		children: [/* @__PURE__ */ h(vi, { ...e }), /* @__PURE__ */ h(mi, {
			...e,
			titles: t
		})]
	});
}
function mi({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ g("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ h(gi, { ...n }), t && /* @__PURE__ */ h(_i, { ...n })]
	});
}
function hi(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function gi({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ h(jr, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => Pr(e, t.clientId)
	});
}
function _i({ meta: e, outlineFooter: t, ...n }) {
	return /* @__PURE__ */ h(vr, {
		...n,
		approval: e.approval,
		children: t
	});
}
function vi({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = zr(n, () => bi(e));
	return /* @__PURE__ */ g(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ h(dr, {}),
			/* @__PURE__ */ h(St, {}),
			/* @__PURE__ */ h(tt, {
				changes: i,
				hosts: r
			})
		]
	});
}
function yi(e, t, n) {
	let r = l(() => he(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function bi(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function xi(e) {
	let t = He(e.blocks), n = new Ke(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Ci(r), {
		doc: t,
		connect: () => Ti(r)
	};
}
function Si(e) {
	return xi(e).connect();
}
function Ci(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => wi(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		wi(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function wi(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Ti(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Ei(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Di(e, n), () => t.handlers.delete(n))
	};
}
function Ei(e, t, n) {
	if (n.type === "update") {
		S(e.doc, y(n.update), t);
		return;
	}
	qe(e.awareness, y(n.update), t);
}
function Di({ doc: e, awareness: t, meta: n }, r) {
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
}, Oi = {
	kept: " ",
	added: "+",
	removed: "-"
};
function ki({ before: e, after: t, className: n }) {
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
			/* @__PURE__ */ h(Ai, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(ji, { section: e }, e.slot)),
			/* @__PURE__ */ h(Mi, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Ai({ changes: e }) {
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
function ji({ section: e }) {
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
					children: [Oi[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Mi({ what: e, changes: t }) {
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
export { ki as PlanDiffView, si as PlanEditor, ft as bypassTemplate, xi as createMemoryHub, At as fromEditorBlocks, Si as localTransport, W as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map