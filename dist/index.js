import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as f, PLAN_FRAGMENT as ne, applyOps as re, changeWords as ie, diffPlans as ae, findSectionSlot as p, isPlanBlock as oe, isRequiredAt as se, newId as m, optionsOf as ce, parseBlock as le, partitionSections as ue, plainText as de, previewProposal as fe, refineInputs as pe, settledBySlot as me, settledCount as he, tableCells as ge, templateFor as _e, toBlocks as ve, toPlanDocument as ye, usesOf as be, validatePlan as xe } from "@re-cinq/planning-document";
import { createPortal as Se } from "react-dom";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
import { offset as Ce } from "@floating-ui/react";
import { SideMenuExtension as we } from "@blocknote/core/extensions";
import { SideMenu as Te, SideMenuController as Ee, SuggestionMenuController as De, createReactBlockSpec as v, useBlockNoteEditor as y, useCreateBlockNote as Oe, useEditorChange as ke, useExtensionState as Ae } from "@blocknote/react";
import { BlockNoteSchema as je, createExtension as Me, filterSuggestionItems as Ne, insertOrUpdateBlockForSlashMenu as Pe } from "@blocknote/core";
import { Plugin as Fe, PluginKey as Ie } from "prosemirror-state";
import { yCursorPluginKey as Le, ySyncPluginKey as Re } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as ze, acceptChange as Be, acceptRefine as Ve, applyChangeAnyway as He, applyRefineAnyway as Ue, askRefine as We, changesIn as Ge, discardChange as Ke, discardRefine as qe, docFromBlocks as Je, fromBase64 as b, proposalsIn as Ye, readBlocks as Xe, staleChanges as Ze, toBase64 as x } from "@re-cinq/planning-yjs";
import { Awareness as Qe, applyAwarenessUpdate as $e, encodeAwarenessUpdate as S } from "y-protocols/awareness";
import { Doc as et, applyUpdate as C, encodeStateAsUpdate as tt } from "yjs";
import { withCollaboration as nt } from "@blocknote/core/yjs";
import { Decoration as rt, DecorationSet as it } from "prosemirror-view";
//#region src/blocks/adapters.ts
var at = n({}), ot = n({ user: {
	id: "",
	name: "Someone"
} });
function w() {
	return i(ot);
}
var T = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
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
function st({ changes: e, hosts: t }) {
	return /* @__PURE__ */ g(h, { children: e.map((e) => /* @__PURE__ */ g(ct, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function ct({ review: e, host: t }) {
	return t ? Se(/* @__PURE__ */ g(lt, { review: e }), t) : null;
}
function lt({ review: e }) {
	return /* @__PURE__ */ _("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: T.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g(ft, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ g(ut, {}),
			/* @__PURE__ */ g(dt, { review: e })
		]
	});
}
function ut() {
	return /* @__PURE__ */ g("p", {
		className: T.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function dt({ review: e }) {
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
function ft({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ g(pt, { removal: t }) : ie(e).map((e, t) => /* @__PURE__ */ g("p", {
		className: T.words,
		children: e
	}, t));
}
function pt({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : ht(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ g("p", {
		className: T.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("p", {
		className: T.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ g("p", {
		className: T.dropped,
		children: /* @__PURE__ */ g("del", { children: e })
	}, t))] });
}
var mt = {
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
function ht(e) {
	return mt[e] ?? "block";
}
//#endregion
//#region src/template/template-guard.ts
var gt = "planTemplateBypass", _t = "section-heading", vt = "blockContent", yt = [
	"plan-title",
	_t,
	"section-panel",
	"section-actions"
], bt = Me({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Fe({ filterTransaction: St })]
});
function xt(e, t) {
	return e.setMeta(gt, t);
}
function St(e, t) {
	if (!e.docChanged || Ct(e)) return !0;
	let n = wt(t.doc), r = wt(e.doc);
	return kt(Et(n), Et(r)) && Dt(n, r);
}
function Ct(e) {
	let t = e.getMeta(Re);
	return !!e.getMeta(gt) || t?.isChangeOrigin === !0;
}
function wt(e) {
	let t = [];
	return e.descendants((e) => {
		Tt(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Tt(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(vt);
}
function Et(e) {
	return e.filter((e) => yt.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function Dt(e, t) {
	return Ot(t) === 0 || Ot(e) > 0;
}
function Ot(e) {
	let t = e.findIndex((e) => e.type === _t);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function kt(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var At = { useFloatingOptions: {
	placement: "left-start",
	middleware: [Ce(({ elements: e, rects: t }) => {
		let n = Nt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function jt() {
	return /* @__PURE__ */ g(Ee, {
		floatingUIOptions: At,
		sideMenu: Mt
	});
}
function Mt() {
	let e = Ae(we, { selector: (e) => e?.block.type });
	return e === void 0 || yt.includes(e) ? null : /* @__PURE__ */ g(Te, {});
}
function Nt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Pt(t) : null;
}
function Pt(e) {
	let t = Ft(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Ft(e) {
	let t = It(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Lt(n);
}
function It(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Lt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Rt(e) {
	return e;
}
function zt(e) {
	return e.map(le);
}
function D(e, t) {
	return ye(zt(e), t);
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
}, Bt = { props: { resolved: !0 } }, Vt = { props: { resolved: !1 } };
function Ht({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = tn(j(e));
	return /* @__PURE__ */ _("aside", {
		className: O.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${M(e)}`,
		...Wt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ g(Gt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ g("div", {
				className: O.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(Ut, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Ut({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: O.actions,
		contentEditable: !1,
		children: [A(e) && /* @__PURE__ */ g(Kt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ g(qt, {
			block: e,
			editor: t
		})]
	});
}
function Wt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Gt({ block: e, resolved: t }) {
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
				children: on(e.props.at)
			}),
			t && /* @__PURE__ */ g("span", {
				className: O.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Kt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ g(k, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Vt)
	}) : /* @__PURE__ */ g(Zt, {
		block: e,
		editor: t
	});
}
function qt({ block: e, editor: t }) {
	let [n, r] = d(!1), i = Xt(e);
	return /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g(k, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ g(Jt, {
		question: Yt(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function Jt({ question: e, onConfirm: t, onCancel: n }) {
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
function Yt(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function Xt(e) {
	let t = y();
	if (!A(e)) return [e];
	let n = j(e);
	return t.document.filter((e) => e.type === "comment" && j(e) === n);
}
function Zt({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ _(h, { children: [n ? /* @__PURE__ */ g(Qt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ g(k, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ g(k, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Bt)
	})] });
}
function k({ label: e, onClick: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Qt({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = en({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ g("form", {
		className: O.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ g($t, {
			to: M(e),
			draft: r,
			onDraft: i
		})
	});
}
function $t({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ g("input", {
		className: O.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function en({ editor: e, block: t }) {
	let { user: n } = w(), r = y();
	return (i) => {
		if (!i) return;
		let a = j(t), o = r.document, s = rn(o, a) ?? t;
		e.insertBlocks([an(a, i, n.name)], s, "after");
	};
}
function tn(e) {
	let t = y(), n = () => nn(t.document, e), [r, i] = d(n);
	return ke(() => i(n())), r;
}
function nn(e, t) {
	return e.some((e) => A(e) && j(e) === t && e.props.resolved === !0);
}
function rn(e, t) {
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
function an(e, t, n) {
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
function on(e) {
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
function sn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ _("aside", {
		className: N.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": un(r),
		children: [
			/* @__PURE__ */ g(cn, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ g("div", {
				className: N.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(ln, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function cn({ severity: e, why: t }) {
	return /* @__PURE__ */ _("p", {
		className: N.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("span", {
			className: N.label,
			children: un(e)
		}), t && /* @__PURE__ */ g("span", {
			className: N.why,
			children: t
		})]
	});
}
function ln({ block: e, editor: t, resolved: n }) {
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
function un(e) {
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
function dn({ block: e }) {
	let { renderMockup: t } = o(at);
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
var fn = {
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
}, pn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function mn({ spec: e, value: t, onChange: n, readOnly: r }) {
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
		}), a.map((e, t) => /* @__PURE__ */ g(hn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function hn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ _("label", {
		className: F.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ g("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), pn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var gn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function _n(e, t) {
	return e[String(t)] ?? String(t);
}
var I = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function vn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ _("span", {
		className: I.field,
		"data-field": e,
		children: [/* @__PURE__ */ g("label", {
			className: I.label,
			htmlFor: n,
			children: _n(gn, e)
		}), /* @__PURE__ */ g(yn, {
			...t,
			id: n
		})]
	});
}
function yn(e) {
	return e.spec.values ? /* @__PURE__ */ g(bn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ g(xn, { ...e });
}
function bn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ g("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ g("option", { children: e }, e))
	});
}
function xn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
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
var Sn = { maturity: mn };
function Cn({ block: e, editor: t, contentRef: n }) {
	let r = fn[e.type];
	return /* @__PURE__ */ _("div", {
		className: P.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ g(wn, {
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
function wn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ _("div", {
		className: P.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("p", {
			className: P.head,
			children: [/* @__PURE__ */ g("span", {
				className: P.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ g(Tn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ g(En, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Tn({ view: e, props: t }) {
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
function En({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = f[e.type], o = a;
	return r(Sn[n] ?? vn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Dn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function On({ contentRef: e }) {
	return /* @__PURE__ */ g("h1", {
		className: Dn.title,
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
function kn({ block: e, editor: t, contentRef: n }) {
	let r = ce(e.props.options);
	return /* @__PURE__ */ _("div", {
		className: L.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ g(An, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ g("div", {
				className: L.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ g(jn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function An({ why: e, picks: t, used: n }) {
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
function jn({ block: e, editor: t, options: n }) {
	return Ln(zn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ g(Mn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ g(Pn, {
		block: e,
		editor: t
	});
}
function Mn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ g("ul", {
		className: L.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(Nn, {
			onPick: () => In(t, e, n),
			children: n
		}) }, n))
	});
}
function Nn({ onPick: e, children: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: L.suggestion,
		onClick: e,
		children: t
	});
}
function Pn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ _("form", {
		className: L.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), In(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ g(Fn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ g("button", {
			type: "submit",
			className: L.answerButton,
			children: "Answer"
		})]
	});
}
function Fn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ g("input", {
		className: L.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function In(e, t, n) {
	if (!n) return;
	let r = zn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Ln(e) {
	let t = y(), [n, r] = d(() => Rn(t.document, e));
	return ke(() => r(Rn(t.document, e))), n;
}
function Rn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function zn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var R = n(null), Bn = n(/* @__PURE__ */ new Map());
function z(e) {
	let t = o(R), n = o(Bn).get(e);
	return t ? p(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var B = /* @__PURE__ */ new WeakMap();
function Vn(e) {
	let t = B.get(e);
	if (t) return t;
	let n = Xe(e);
	return B.set(e, n), e.once("update", () => B.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function Hn(e, t) {
	let n = Gn(e);
	return l(() => {
		let n = Vn(e), r = pe(n, t), i = Ye(e), a = i.find((e) => e.slot === t);
		return {
			inputs: r,
			settled: he(r),
			proposal: a,
			busyFor: Un(i, t),
			preview: a?.status === "proposed" ? fe(n, a) : void 0,
			...Wn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Un(e, t) {
	return e.find((e) => e.slot !== t && e.status === "asked")?.askedBy;
}
function Wn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: be(n),
			baseHash: We(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Ve(e, t),
		applyAnyway: () => void Ue(e, t),
		discard: () => qe(e, t)
	};
}
function Gn(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Kn(e) {
	let t = Hn(e.doc, e.slot), [n, r] = d(null), i = Jn(e, t, r), a = {
		...e,
		refine: t,
		ask: i,
		refusal: n
	};
	return t.proposal ? /* @__PURE__ */ g(qn, {
		...a,
		proposal: t.proposal
	}) : /* @__PURE__ */ g(Xn, { ...a });
}
function qn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ g($n, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ g(er, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ g(tr, {
			...t,
			proposal: e
		});
	}
}
function Jn({ slot: e, title: t }, n, r) {
	let { user: i, onRefine: a } = w();
	return () => {
		r(null);
		let o = n.ask(i.name);
		a?.({
			slot: e,
			title: t,
			...o
		}).catch((e) => {
			n.discard(), r(Yn(e));
		});
	};
}
function Yn(e) {
	return e instanceof Error ? e.message : String(e);
}
function Xn({ refine: e, ask: t, refusal: n }) {
	let r = e.settled > 0 && e.busyFor === void 0;
	return /* @__PURE__ */ _(h, { children: [n && /* @__PURE__ */ g(Zn, { reason: n }), /* @__PURE__ */ _("p", {
		className: E.bar,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: E.refine,
			disabled: !r,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ g("span", {
			className: E.note,
			children: Qn(e)
		})]
	})] });
}
function Zn({ reason: e }) {
	return /* @__PURE__ */ _("p", {
		className: E.failed,
		role: "alert",
		children: ["The agent cannot refine this section now: ", e]
	});
}
function Qn(e) {
	return e.busyFor === void 0 ? e.settled > 0 ? `uses ${or(e)}` : "Answer a question or resolve a thread to refine" : `The agent is refining another section for ${e.busyFor}; refine this one when it finishes`;
}
function $n({ refine: e, askedBy: t }) {
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
function er({ refine: e, ask: t, reason: n }) {
	return /* @__PURE__ */ _("section", {
		className: E.proposal,
		children: [/* @__PURE__ */ _("p", {
			className: E.failed,
			role: "alert",
			children: ["The agent could not refine this section: ", n]
		}), /* @__PURE__ */ _("p", {
			className: E.bar,
			children: [/* @__PURE__ */ g(rr, {
				label: "Ask again",
				run: t,
				disabled: e.busyFor !== void 0
			}), /* @__PURE__ */ g(V, {
				label: "Dismiss",
				run: e.discard
			})]
		})]
	});
}
function tr({ refine: e, ask: t, title: n, proposal: r }) {
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
					sr(r)
				]
			}),
			/* @__PURE__ */ g(ir, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ g(nr, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function nr({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept], a = n && e.busyFor !== void 0;
	return /* @__PURE__ */ _("p", {
		className: E.bar,
		children: [
			/* @__PURE__ */ g(rr, {
				label: r,
				run: i,
				disabled: a
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
function rr({ label: e, run: t, disabled: n = !1 }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: E.refine,
		disabled: n,
		onClick: t,
		children: e
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
function ir({ lines: e }) {
	return /* @__PURE__ */ g("ul", {
		className: E.lines,
		children: e.map((e, t) => /* @__PURE__ */ g("li", {
			className: E[e.kind],
			children: /* @__PURE__ */ g(ar, { line: e })
		}, `${t}-${e.text}`))
	});
}
function ar({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ g("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ g("del", { children: e.text }) : e.text;
}
function or({ inputs: e }) {
	return cr(e.answered.length, e.resolved.length);
}
function sr({ uses: e }) {
	let t = cr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function cr(e, t) {
	return [lr(e, "answer"), lr(t, "resolved thread")].filter(Boolean).join(", ");
}
function lr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var ur = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function dr({ block: e, editor: t }) {
	let { slot: n, title: r } = fr(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ g("div", {
		role: "group",
		className: ur.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(Kn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function fr(e) {
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
function pr({ block: e }) {
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
function mr({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = z(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ g("aside", {
		className: U.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(hr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function hr({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = d("");
	return /* @__PURE__ */ _("form", {
		className: U.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(_r({
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
		}), /* @__PURE__ */ g(gr, {})]
	});
}
function gr() {
	return /* @__PURE__ */ g("button", {
		type: "submit",
		className: U.send,
		children: "Comment"
	});
}
function _r({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([vr(n, r)], e, "before"), "");
}
function vr(e, t) {
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
var W = { render: Cn }, yr = {
	"plan-title": v(f["plan-title"], { render: On })(),
	"section-heading": v(f["section-heading"], { render: pr })(),
	"section-panel": v(f["section-panel"], { render: mr })(),
	"section-actions": v(f["section-actions"], { render: dr })(),
	comment: v(f.comment, { render: Ht })(),
	finding: v(f.finding, { render: sn })(),
	kpi: v(f.kpi, W)(),
	prototype: v(f.prototype, W)(),
	mockup: v(f.mockup, { render: dn })(),
	question: v(f.question, { render: kn })(),
	answer: v(f.answer, W)()
}, G = je.create({ blockSpecs: {
	...ze,
	...yr
} });
//#endregion
//#region src/menu/section-context.ts
function br(e, t) {
	let [n] = Sr(e, t);
	return n ? String(n.props.slot) : null;
}
function xr(e, t) {
	let n = Sr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function Sr(e, t) {
	let n = e.slice(0, Cr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Cr(e, t) {
	return e.findIndex((e) => wr(e, t));
}
function wr(e, t) {
	return e.id === t || e.children.some((e) => wr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", Tr = { cells: [
	"",
	"",
	""
] }, Er = [
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
			rows: [Tr, Tr]
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
			let t = xr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Dr(e, t) {
	return Er.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Or(e, t));
}
function Or(e, t) {
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
function kr() {
	let e = y(G), t = o(R);
	return /* @__PURE__ */ g(De, {
		triggerCharacter: "/",
		getItems: async (n) => Ne(Ar(e, t), n)
	});
}
function Ar(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && jr(t, i);
	return a ? Dr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Pe(e, Rt(t))
	})) : [];
}
function jr(e, { blocks: t, cursorId: n }) {
	let r = br(t, n);
	return r === null ? void 0 : p(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Mr(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => ({
		...Nr(e, t, n),
		inPlan: r.has(t.slot)
	}));
}
function Nr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && se(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Pr(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var J = {
	outline: "_outline_1r3yu_1",
	phase: "_phase_1r3yu_6",
	slots: "_slots_1r3yu_13",
	title: "_title_1r3yu_21",
	locate: "_locate_1r3yu_22",
	required: "_required_1r3yu_53",
	settled: "_settled_1r3yu_57",
	problems: "_problems_1r3yu_61",
	footer: "_footer_1r3yu_67"
}, Fr = [], Ir = /* @__PURE__ */ new Map();
function Lr({ approval: e = null, children: t, ...n }) {
	return /* @__PURE__ */ _("nav", {
		className: J.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ g("p", {
				className: J.phase,
				children: e ? zr(e) : Rr(n.report)
			}),
			/* @__PURE__ */ g(Vr, { ...n }),
			t && /* @__PURE__ */ g("div", {
				className: J.footer,
				children: t
			})
		]
	});
}
function Rr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function zr({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Br(t)}`;
}
function Br(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Vr(e) {
	return /* @__PURE__ */ g("ol", {
		className: J.slots,
		children: Hr(e).map((e) => /* @__PURE__ */ g(Ur, { ...e }, e.section.slot))
	});
}
function Hr({ template: e, report: t, sections: n = Fr, settled: r = Ir, onLocate: i }) {
	let a = Pr(t.problems);
	return Mr(e, n, t.phase).map((e) => ({
		section: e,
		problems: a.get(e.slot) ?? [],
		settled: r.get(e.slot) ?? 0,
		onLocate: i
	}));
}
function Ur({ problems: e, settled: t, ...n }) {
	let { section: r } = n;
	return /* @__PURE__ */ _("li", {
		"aria-label": r.title,
		children: [
			/* @__PURE__ */ g(Wr, { ...n }),
			r.required && /* @__PURE__ */ g("span", {
				className: J.required,
				children: " required"
			}),
			t > 0 && /* @__PURE__ */ _("span", {
				className: J.settled,
				children: [" ", Gr(t)]
			}),
			/* @__PURE__ */ g("ul", {
				className: J.problems,
				children: e.map((e) => /* @__PURE__ */ g("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
function Wr({ section: e, onLocate: t }) {
	return !t || !e.inPlan ? /* @__PURE__ */ g("span", {
		className: J.title,
		children: e.title
	}) : /* @__PURE__ */ g("button", {
		type: "button",
		className: J.locate,
		onClick: () => t(e.slot),
		children: e.title
	});
}
function Gr(e) {
	return `${e} ${e === 1 ? "settled input" : "settled inputs"} waiting for a refine`;
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
function Kr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(qr)) t.has(n.userId) || t.set(n.userId, Yr(n.color, [...t.values()]));
	return t;
}
function qr(e, t) {
	return Number(Jr(t)) - Number(Jr(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Jr({ color: e }) {
	return e !== void 0 && Z.includes(e);
}
function Yr(e, t) {
	let n = Z.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? Z[t.length % Z.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Xr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Zr(e, n)]);
}
function Zr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Q(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? Z[0]),
		slot: ti(n),
		hasCursor: r != null
	};
}
function Qr(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [$r(e, t)] : []);
}
function $r(e, t) {
	return {
		clientId: e,
		userId: Q(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function ei(e, t) {
	let n = e.get(t)?.user, r = n && Kr(Qr(e)).get(Q(t, n));
	return r === n?.color ? void 0 : r;
}
function Q(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function ti(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function ni(e, t, n) {
	let r = e.slot && p(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var ri = "⁠";
function ii(e) {
	let t = `background-color: var(${oi(e.id ?? "")}, ${e.color}); color: white`, n = ci("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = ci("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = ci("bn-collaboration-cursor__base");
	return i.append(ri, r, ri), i;
}
function ai(e, t) {
	t.forEach((t) => e.style.setProperty(oi(t.id), t.color));
}
function oi(e) {
	return `--ps-peer-${[...e].map(si).join("")}`;
}
function si(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function ci(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function li(e) {
	let [t, n] = d(() => hi(e));
	return pi(e, () => n(hi(e))), t;
}
function ui(e, t) {
	mi(e, t), di(t), fi(e, t);
}
function di(e) {
	pi(e, () => {
		let t = ei(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function fi(e, t) {
	pi(t, () => {
		let n = e.domElement;
		n && ai(n, hi(t));
	});
}
function pi(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function mi(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: br(r, n.id) });
	}), [e, t]);
}
function hi(e) {
	return Xr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function gi({ awareness: e, ...t }) {
	let n = li(e);
	return n.length === 0 ? null : /* @__PURE__ */ g("ul", {
		className: X.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(_i, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function _i({ user: e, template: t, titles: n, onLocate: r }) {
	let i = ni(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ g("button", {
		type: "button",
		className: X.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: vi,
		onClick: () => r(e),
		children: /* @__PURE__ */ g(yi, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ g("span", {
		className: X.away,
		children: /* @__PURE__ */ g(yi, {
			color: e.color,
			label: i
		})
	});
}
function vi(e) {
	e.preventDefault();
}
function yi({ color: e, label: t }) {
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
function bi(e, t) {
	let n = e.prosemirrorView, r = xi(n, t);
	r !== null && Si(n, r)?.scrollIntoView({ block: "center" });
}
function xi(e, t) {
	let [n] = Le.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function Si(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var Ci = { notice: "_notice_1xdcv_1" }, wi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Ti({ status: e, reason: t }) {
	return /* @__PURE__ */ _("p", {
		className: Ci.notice,
		role: "status",
		"data-status": e,
		children: [wi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Ei(e, t) {
	let n = Li(e, t);
	return l(() => Di(e), [e, n]);
}
function Di(e) {
	let t = new Set(Ze(e).map((e) => e.changeId)), n = Vn(e);
	return Ge(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: ki(n, r),
		write: () => t.has(r.changeId) ? He(e, r.changeId) : Be(e, r.changeId),
		discard: () => Ke(e, r.changeId)
	}));
}
var Oi = {
	"remove-block": Ai,
	"set-section-text": ji,
	"set-section-prose": ji
};
function ki(e, t) {
	let n = Oi[t.op.op];
	return n && ie(t).length === 0 ? n(e, t) : void 0;
}
function Ai(e, t) {
	let n = e.flatMap(Ni).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: Fi(n)
	};
}
function ji(e, { op: t, slot: n }) {
	let r = new Set(Mi(re(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Mi(e, n).filter((e) => !r.has(e.id)).flatMap(Fi)
	};
}
function Mi(e, t) {
	return ue(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Ni(e) {
	return [e, ...Pi(e).flatMap(Ni)];
}
function Pi(e) {
	return oe(e) ? [] : e.children;
}
function Fi(e) {
	return [Ii(e.content), ...Pi(e).flatMap(Fi)].filter(Boolean);
}
function Ii(e) {
	return Array.isArray(e) ? de(e) : ge(e).flat().map(de).join(" · ");
}
function Li(e, t) {
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
var Ri = "plan-transport", zi = class extends Qe {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Bi(e) {
	let t = new et(), n = {
		doc: t,
		awareness: new zi(t)
	}, r = Hi({
		status: "connecting",
		meta: null
	});
	Gi(n, e);
	let i = e.subscribe((e) => Wi({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Vi(n, i)
	};
}
function Vi({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Hi(e) {
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
var Ui = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		C(e, b(n), Ri), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => C(e, b(t), Ri),
	awareness: ({ awareness: e }, { update: t }) => $e(e, b(t), Ri),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Wi(e, t) {
	Ui[t.type](e, t);
}
function Gi({ doc: t, awareness: n }, r) {
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
function Ki(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = Bi(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function qi(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Ji = new Ie("planChangeWidgets");
function Yi(e, t) {
	return Me({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new Fe({
			key: Ji,
			props: { decorations: (n) => it.create(n.doc, Xi(n, e, t)) }
		})]
	});
}
function Xi(e, t, n) {
	let r = ea(e);
	return Ge(t).flatMap((e) => {
		let t = Zi(r, e);
		return t === void 0 ? [] : [Qi(t, e, n)];
	});
}
function Zi(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Qi(e, t, n) {
	return rt.widget(e, () => $i(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function $i(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function ea(e) {
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
function ta({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = na(e, n, i), s = ra(o, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => D(s, t), [s, t]),
		hosts: i
	};
}
function na(e, t, n) {
	let { doc: r } = e;
	return Oe(nt({
		schema: G,
		extensions: [bt, Yi(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(ne),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: ii
		}
	}), [e]);
}
function ra(e, t, n) {
	let [r, i] = d(() => Xe(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var ia = {};
function aa({ transport: e, adapters: t = ia, className: n, ...r }) {
	let i = Ki(e), a = oa(r);
	return /* @__PURE__ */ g(at, {
		value: t,
		children: /* @__PURE__ */ g("div", {
			className: sa({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ g(ca, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ g(Ti, { status: "connecting" })
		})
	});
}
function oa({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function sa({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? Y.withSidebar : Y.single;
	return [
		Y.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ca({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = qi(t.session);
	if (!r) return /* @__PURE__ */ g(Ti, {
		status: n,
		reason: i
	});
	let a = e ?? _e(r.type);
	return /* @__PURE__ */ _(R, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ g(Ti, {
			status: n,
			reason: i
		}), /* @__PURE__ */ g(la, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function la({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = ta(r), l = ua(i, o, c), u = ya(s, e, t);
	return ui(o, i.awareness), /* @__PURE__ */ g(ot, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ g(da, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function ua(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function da(e) {
	let t = pa(e.sections);
	return /* @__PURE__ */ _(Bn, {
		value: t,
		children: [/* @__PURE__ */ g(va, { ...e }), /* @__PURE__ */ g(fa, {
			...e,
			titles: t
		})]
	});
}
function fa({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ _("aside", {
		className: Y.sidebar,
		children: [e && /* @__PURE__ */ g(ma, { ...n }), t && /* @__PURE__ */ g(ha, { ...n })]
	});
}
function pa(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function ma({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ g(gi, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => bi(e, t.clientId)
	});
}
function ha({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = _a(r.sections);
	return /* @__PURE__ */ g(Lr, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => ga(e, t),
		children: n
	});
}
function ga(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function _a(e) {
	return l(() => me(ve({ sections: e }), e.map((e) => e.slot)), [e]);
}
function va({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Ei(n, () => ba(e));
	return /* @__PURE__ */ _(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ g(kr, {}),
			/* @__PURE__ */ g(jt, {}),
			/* @__PURE__ */ g(st, {
				changes: i,
				hosts: r
			})
		]
	});
}
function ya(e, t, n) {
	let r = l(() => xe(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function ba(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function xa(e) {
	let t = Je(e.blocks), n = new Qe(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Ca(r), {
		doc: t,
		connect: () => Ta(r)
	};
}
function Sa(e) {
	return xa(e).connect();
}
function Ca(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => wa(t, n, {
		type: "update",
		update: x(e)
	})), r.on("update", (n, i) => {
		let a = S(r, e(n));
		wa(t, i, {
			type: "awareness",
			update: x(a)
		});
	});
}
function wa(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Ta(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Ea(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Da(e, n), () => t.handlers.delete(n))
	};
}
function Ea(e, t, n) {
	if (n.type === "update") {
		C(e.doc, b(n.update), t);
		return;
	}
	$e(e.awareness, b(n.update), t);
}
function Da({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: x(tt(e))
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
}, Oa = {
	kept: " ",
	added: "+",
	removed: "-"
};
function ka({ before: e, after: t, className: n }) {
	let r = ae(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ g(Aa, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ g(ja, { section: e }, e.slot)),
			/* @__PURE__ */ g(Ma, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Aa({ changes: e }) {
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
function ja({ section: e }) {
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
					children: [Oa[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Ma({ what: e, changes: t }) {
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
export { ka as PlanDiffView, aa as PlanEditor, xt as bypassTemplate, xa as createMemoryHub, zt as fromEditorBlocks, Sa as localTransport, G as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map