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
		"aria-label": `Comment by ${an(e)}`,
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
				children: an(e)
			}),
			/* @__PURE__ */ g("time", {
				className: O.when,
				children: sn(e.props.at)
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
			to: an(e),
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
		e.insertBlocks([on(a, i, n.name)], s, "after");
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
function an(e) {
	return String(e.props.author || "Someone");
}
function on(e, t, n) {
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
function sn(e) {
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
function cn({ block: e, editor: t, contentRef: n }) {
	let r = String(e.props.severity ?? ""), i = e.props.resolved === !0;
	return /* @__PURE__ */ _("aside", {
		className: M.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": dn(r),
		children: [
			/* @__PURE__ */ g(ln, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ g("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ g(un, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function ln({ severity: e, why: t }) {
	return /* @__PURE__ */ _("p", {
		className: M.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("span", {
			className: M.label,
			children: dn(e)
		}), t && /* @__PURE__ */ g("span", {
			className: M.why,
			children: t
		})]
	});
}
function un({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: M.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ g("button", {
			type: "button",
			onClick: () => t.updateBlock(e, { props: { resolved: !n } }),
			children: n ? "Reopen" : "Resolve"
		})
	});
}
function dn(e) {
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
function fn({ block: e }) {
	let { renderMockup: t } = o(at);
	return /* @__PURE__ */ _("figure", {
		className: N.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ _("figcaption", {
			className: N.label,
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
var pn = {
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
}, mn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function hn({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: P.steps,
		disabled: r
	};
	return /* @__PURE__ */ _("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ g("legend", {
			className: P.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ g(gn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function gn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ _("label", {
		className: P.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ g("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), mn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var _n = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function vn(e, t) {
	return e[String(t)] ?? String(t);
}
var F = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function yn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ _("span", {
		className: F.field,
		"data-field": e,
		children: [/* @__PURE__ */ g("label", {
			className: F.label,
			htmlFor: n,
			children: vn(_n, e)
		}), /* @__PURE__ */ g(bn, {
			...t,
			id: n
		})]
	});
}
function bn(e) {
	return e.spec.values ? /* @__PURE__ */ g(xn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ g(Sn, { ...e });
}
function xn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ g("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ g("option", { children: e }, e))
	});
}
function Sn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ g("input", {
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
var Cn = { maturity: hn };
function wn({ block: e, editor: t, contentRef: n }) {
	let r = pn[e.type];
	return /* @__PURE__ */ _("div", {
		className: N.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ g(Tn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ g("div", {
			className: N.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function Tn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ _("div", {
		className: N.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("p", {
			className: N.head,
			children: [/* @__PURE__ */ g("span", {
				className: N.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ g(En, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ g(Dn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function En({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ _("a", {
		className: N.link,
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
function Dn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = f[e.type], o = a;
	return r(Cn[n] ?? yn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var On = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function kn({ contentRef: e }) {
	return /* @__PURE__ */ g("h1", {
		className: On.title,
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
function An({ block: e, editor: t, contentRef: n }) {
	let r = ce(e.props.options);
	return /* @__PURE__ */ _("div", {
		className: I.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ g(jn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ g("div", {
				className: I.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ g(Mn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function jn({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ g("p", {
		className: I.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ g("span", {
			className: I.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ _("p", {
		className: I.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ g("span", {
				className: I.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ g("span", {
				className: I.why,
				children: e
			}),
			/* @__PURE__ */ g("span", {
				className: I.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Mn({ block: e, editor: t, options: n }) {
	return Rn(Bn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ g(Nn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ g(Fn, {
		block: e,
		editor: t
	});
}
function Nn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ g("ul", {
		className: I.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(Pn, {
			onPick: () => Ln(t, e, n),
			children: n
		}) }, n))
	});
}
function Pn({ onPick: e, children: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: I.suggestion,
		onClick: e,
		children: t
	});
}
function Fn({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ _("form", {
		className: I.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Ln(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ g(In, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ g("button", {
			type: "submit",
			className: I.answerButton,
			children: "Answer"
		})]
	});
}
function In({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ g("input", {
		className: I.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Ln(e, t, n) {
	if (!n) return;
	let r = Bn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Rn(e) {
	let t = y(), [n, r] = d(() => zn(t.document, e));
	return ke(() => r(zn(t.document, e))), n;
}
function zn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Bn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var L = n(null), Vn = n(/* @__PURE__ */ new Map());
function R(e) {
	let t = o(L), n = o(Vn).get(e);
	return t ? p(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var z = /* @__PURE__ */ new WeakMap();
function Hn(e) {
	let t = z.get(e);
	if (t) return t;
	let n = Xe(e);
	return z.set(e, n), e.once("update", () => z.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function Un(e, t) {
	let n = Gn(e);
	return l(() => {
		let n = Hn(e), r = pe(n, t), i = Ye(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: he(r),
			proposal: i,
			preview: i?.status === "proposed" ? fe(n, i) : void 0,
			...Wn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
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
	let t = Un(e.doc, e.slot), n = Jn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal ? /* @__PURE__ */ g(qn, {
		...r,
		proposal: t.proposal
	}) : /* @__PURE__ */ g(Yn, { ...r });
}
function qn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ g(Xn, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ g(Zn, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ g(Qn, {
			...t,
			proposal: e
		});
	}
}
function Jn({ slot: e, title: t }, n) {
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
function Yn({ refine: e, ask: t }) {
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
			children: n ? `uses ${nr(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Xn({ refine: e, askedBy: t }) {
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
function Zn({ refine: e, ask: t, reason: n }) {
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
			}), /* @__PURE__ */ g(B, {
				label: "Dismiss",
				run: e.discard
			})]
		})]
	});
}
function Qn({ refine: e, ask: t, title: n, proposal: r }) {
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
					rr(r)
				]
			}),
			/* @__PURE__ */ g(er, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ g($n, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function $n({ refine: e, ask: t, stale: n }) {
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
			n && /* @__PURE__ */ g(B, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ g(B, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function B({ label: e, run: t }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: E.quiet,
		onClick: t,
		children: e
	});
}
function er({ lines: e }) {
	return /* @__PURE__ */ g("ul", {
		className: E.lines,
		children: e.map((e, t) => /* @__PURE__ */ g("li", {
			className: E[e.kind],
			children: /* @__PURE__ */ g(tr, { line: e })
		}, `${t}-${e.text}`))
	});
}
function tr({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ g("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ g("del", { children: e.text }) : e.text;
}
function nr({ inputs: e }) {
	return ir(e.answered.length, e.resolved.length);
}
function rr({ uses: e }) {
	let t = ir(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function ir(e, t) {
	return [ar(e, "answer"), ar(t, "resolved thread")].filter(Boolean).join(", ");
}
function ar(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var or = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function sr({ block: e, editor: t }) {
	let { slot: n, title: r } = cr(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ g("div", {
		role: "group",
		className: or.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(Kn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function cr(e) {
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
function lr({ block: e }) {
	let t = R(e.props.slot);
	return /* @__PURE__ */ _("header", {
		className: V.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("h2", {
			className: V.title,
			children: e.props.title
		}), t && /* @__PURE__ */ g("p", {
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
function ur({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = R(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ g("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ g(dr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function dr({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = d("");
	return /* @__PURE__ */ _("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(pr({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ g("input", {
			className: H.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ g(fr, {})]
	});
}
function fr() {
	return /* @__PURE__ */ g("button", {
		type: "submit",
		className: H.send,
		children: "Comment"
	});
}
function pr({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([mr(n, r)], e, "before"), "");
}
function mr(e, t) {
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
var U = { render: wn }, hr = {
	"plan-title": v(f["plan-title"], { render: kn })(),
	"section-heading": v(f["section-heading"], { render: lr })(),
	"section-panel": v(f["section-panel"], { render: ur })(),
	"section-actions": v(f["section-actions"], { render: sr })(),
	comment: v(f.comment, { render: Ht })(),
	finding: v(f.finding, { render: cn })(),
	kpi: v(f.kpi, U)(),
	prototype: v(f.prototype, U)(),
	mockup: v(f.mockup, { render: fn })(),
	question: v(f.question, { render: An })(),
	answer: v(f.answer, U)()
}, W = je.create({ blockSpecs: {
	...ze,
	...hr
} });
//#endregion
//#region src/menu/section-context.ts
function gr(e, t) {
	let [n] = vr(e, t);
	return n ? String(n.props.slot) : null;
}
function _r(e, t) {
	let n = vr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function vr(e, t) {
	let n = e.slice(0, yr(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function yr(e, t) {
	return e.findIndex((e) => br(e, t));
}
function br(e, t) {
	return e.id === t || e.children.some((e) => br(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", xr = { cells: [
	"",
	"",
	""
] }, Sr = [
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
			rows: [xr, xr]
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
			let t = _r(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Cr(e, t) {
	return Sr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => wr(e, t));
}
function wr(e, t) {
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
function Tr() {
	let e = y(W), t = o(L);
	return /* @__PURE__ */ g(De, {
		triggerCharacter: "/",
		getItems: async (n) => Ne(Er(e, t), n)
	});
}
function Er(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && Dr(t, i);
	return a ? Cr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Pe(e, Rt(t))
	})) : [];
}
function Dr(e, { blocks: t, cursorId: n }) {
	let r = gr(t, n);
	return r === null ? void 0 : p(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Or(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => ({
		...kr(e, t, n),
		inPlan: r.has(t.slot)
	}));
}
function kr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && se(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Ar(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var q = {
	outline: "_outline_gkb3j_1",
	phase: "_phase_gkb3j_6",
	slots: "_slots_gkb3j_13",
	title: "_title_gkb3j_20",
	locate: "_locate_gkb3j_21",
	required: "_required_gkb3j_39",
	settled: "_settled_gkb3j_43",
	problems: "_problems_gkb3j_47",
	footer: "_footer_gkb3j_53"
}, jr = [], Mr = /* @__PURE__ */ new Map();
function Nr({ approval: e = null, children: t, ...n }) {
	return /* @__PURE__ */ _("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ g("p", {
				className: q.phase,
				children: e ? Fr(e) : Pr(n.report)
			}),
			/* @__PURE__ */ g(Lr, { ...n }),
			t && /* @__PURE__ */ g("div", {
				className: q.footer,
				children: t
			})
		]
	});
}
function Pr(e) {
	return `${e.passed ? "Ready for" : "Not ready for"} ${e.phase}`;
}
function Fr({ approvedBy: e, approvedAt: t }) {
	return `Approved by ${e} on ${Ir(t)}`;
}
function Ir(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : t.toLocaleDateString();
}
function Lr(e) {
	return /* @__PURE__ */ g("ol", {
		className: q.slots,
		children: Rr(e).map((e) => /* @__PURE__ */ g(zr, { ...e }, e.section.slot))
	});
}
function Rr({ template: e, report: t, sections: n = jr, settled: r = Mr, onLocate: i }) {
	let a = Ar(t.problems);
	return Or(e, n, t.phase).map((e) => ({
		section: e,
		problems: a.get(e.slot) ?? [],
		settled: r.get(e.slot) ?? 0,
		onLocate: i
	}));
}
function zr({ problems: e, settled: t, ...n }) {
	let { section: r } = n;
	return /* @__PURE__ */ _("li", {
		"aria-label": r.title,
		children: [
			/* @__PURE__ */ g(Br, { ...n }),
			r.required && /* @__PURE__ */ g("span", {
				className: q.required,
				children: " required"
			}),
			t > 0 && /* @__PURE__ */ _("span", {
				className: q.settled,
				children: [" ", Vr(t)]
			}),
			/* @__PURE__ */ g("ul", {
				className: q.problems,
				children: e.map((e) => /* @__PURE__ */ g("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
function Br({ section: e, onLocate: t }) {
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
function Vr(e) {
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
function Hr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(Ur)) t.has(n.userId) || t.set(n.userId, Gr(n.color, [...t.values()]));
	return t;
}
function Ur(e, t) {
	return Number(Wr(t)) - Number(Wr(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Wr({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function Gr(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Kr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [qr(e, n)]);
}
function qr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Z(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: Zr(n),
		hasCursor: r != null
	};
}
function Jr(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Yr(e, t)] : []);
}
function Yr(e, t) {
	return {
		clientId: e,
		userId: Z(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Xr(e, t) {
	let n = e.get(t)?.user, r = n && Hr(Jr(e)).get(Z(t, n));
	return r === n?.color ? void 0 : r;
}
function Z(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Zr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Qr(e, t, n) {
	let r = e.slot && p(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var $r = "⁠";
function ei(e) {
	let t = `background-color: var(${ni(e.id ?? "")}, ${e.color}); color: white`, n = Q("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Q("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Q("bn-collaboration-cursor__base");
	return i.append($r, r, $r), i;
}
function ti(e, t) {
	t.forEach((t) => e.style.setProperty(ni(t.id), t.color));
}
function ni(e) {
	return `--ps-peer-${[...e].map(ri).join("")}`;
}
function ri(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Q(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function ii(e) {
	let [t, n] = d(() => ui(e));
	return ci(e, () => n(ui(e))), t;
}
function ai(e, t) {
	li(e, t), oi(t), si(e, t);
}
function oi(e) {
	ci(e, () => {
		let t = Xr(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function si(e, t) {
	ci(t, () => {
		let n = e.domElement;
		n && ti(n, ui(t));
	});
}
function ci(e, t) {
	let n = u(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function li(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: gr(r, n.id) });
	}), [e, t]);
}
function ui(e) {
	return Kr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function di({ awareness: e, ...t }) {
	let n = ii(e);
	return n.length === 0 ? null : /* @__PURE__ */ g("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ g("li", { children: /* @__PURE__ */ g(fi, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function fi({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Qr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ g("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: pi,
		onClick: () => r(e),
		children: /* @__PURE__ */ g(mi, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ g("span", {
		className: Y.away,
		children: /* @__PURE__ */ g(mi, {
			color: e.color,
			label: i
		})
	});
}
function pi(e) {
	e.preventDefault();
}
function mi({ color: e, label: t }) {
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
function hi(e, t) {
	let n = e.prosemirrorView, r = gi(n, t);
	r !== null && _i(n, r)?.scrollIntoView({ block: "center" });
}
function gi(e, t) {
	let [n] = Le.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function _i(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var vi = { notice: "_notice_1xdcv_1" }, yi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function bi({ status: e, reason: t }) {
	return /* @__PURE__ */ _("p", {
		className: vi.notice,
		role: "status",
		"data-status": e,
		children: [yi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function xi(e, t) {
	let n = Mi(e, t);
	return l(() => Si(e), [e, n]);
}
function Si(e) {
	let t = new Set(Ze(e).map((e) => e.changeId)), n = Hn(e);
	return Ge(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: wi(n, r),
		write: () => t.has(r.changeId) ? He(e, r.changeId) : Be(e, r.changeId),
		discard: () => Ke(e, r.changeId)
	}));
}
var Ci = {
	"remove-block": Ti,
	"set-section-text": Ei,
	"set-section-prose": Ei
};
function wi(e, t) {
	let n = Ci[t.op.op];
	return n && ie(t).length === 0 ? n(e, t) : void 0;
}
function Ti(e, t) {
	let n = e.flatMap(Oi).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: Ai(n)
	};
}
function Ei(e, { op: t, slot: n }) {
	let r = new Set(Di(re(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Di(e, n).filter((e) => !r.has(e.id)).flatMap(Ai)
	};
}
function Di(e, t) {
	return ue(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Oi(e) {
	return [e, ...ki(e).flatMap(Oi)];
}
function ki(e) {
	return oe(e) ? [] : e.children;
}
function Ai(e) {
	return [ji(e.content), ...ki(e).flatMap(Ai)].filter(Boolean);
}
function ji(e) {
	return Array.isArray(e) ? de(e) : ge(e).flat().map(de).join(" · ");
}
function Mi(e, t) {
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
var Ni = "plan-transport", Pi = class extends Qe {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Fi(e) {
	let t = new et(), n = {
		doc: t,
		awareness: new Pi(t)
	}, r = Li({
		status: "connecting",
		meta: null
	});
	Bi(n, e);
	let i = e.subscribe((e) => zi({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Ii(n, i)
	};
}
function Ii({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Li(e) {
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
var Ri = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		C(e, b(n), Ni), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => C(e, b(t), Ni),
	awareness: ({ awareness: e }, { update: t }) => $e(e, b(t), Ni),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function zi(e, t) {
	Ri[t.type](e, t);
}
function Bi({ doc: t, awareness: n }, r) {
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
function Vi(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = Fi(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Hi(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Ui = new Ie("planChangeWidgets");
function Wi(e, t) {
	return Me({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new Fe({
			key: Ui,
			props: { decorations: (n) => it.create(n.doc, Gi(n, e, t)) }
		})]
	});
}
function Gi(e, t, n) {
	let r = Yi(e);
	return Ge(t).flatMap((e) => {
		let t = Ki(r, e);
		return t === void 0 ? [] : [qi(t, e, n)];
	});
}
function Ki(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function qi(e, t, n) {
	return rt.widget(e, () => Ji(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Ji(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Yi(e) {
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
function Xi({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = Zi(e, n, i), s = Qi(o, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => D(s, t), [s, t]),
		hosts: i
	};
}
function Zi(e, t, n) {
	let { doc: r } = e;
	return Oe(nt({
		schema: W,
		extensions: [bt, Wi(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(ne),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: ei
		}
	}), [e]);
}
function Qi(e, t, n) {
	let [r, i] = d(() => Xe(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var $i = {};
function ea({ transport: e, adapters: t = $i, className: n, ...r }) {
	let i = Vi(e), a = ta(r);
	return /* @__PURE__ */ g(at, {
		value: t,
		children: /* @__PURE__ */ g("div", {
			className: na({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ g(ra, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ g(bi, { status: "connecting" })
		})
	});
}
function ta({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function na({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function ra({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Hi(t.session);
	if (!r) return /* @__PURE__ */ g(bi, {
		status: n,
		reason: i
	});
	let a = e ?? _e(r.type);
	return /* @__PURE__ */ _(L, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ g(bi, {
			status: n,
			reason: i
		}), /* @__PURE__ */ g(ia, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ia({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = Xi(r), l = aa(i, o, c), u = ma(s, e, t);
	return ai(o, i.awareness), /* @__PURE__ */ g(ot, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ g(oa, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function aa(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function oa(e) {
	let t = ca(e.sections);
	return /* @__PURE__ */ _(Vn, {
		value: t,
		children: [/* @__PURE__ */ g(pa, { ...e }), /* @__PURE__ */ g(sa, {
			...e,
			titles: t
		})]
	});
}
function sa({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ _("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ g(la, { ...n }), t && /* @__PURE__ */ g(ua, { ...n })]
	});
}
function ca(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function la({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ g(di, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => hi(e, t.clientId)
	});
}
function ua({ editor: e, meta: t, outlineFooter: n, ...r }) {
	let i = fa(r.sections);
	return /* @__PURE__ */ g(Nr, {
		...r,
		settled: i,
		approval: t.approval,
		onLocate: (t) => da(e, t),
		children: n
	});
}
function da(e, t) {
	let { dom: n } = e.prosemirrorView;
	n.querySelector(`header[data-slot="${CSS.escape(t)}"]`)?.scrollIntoView({ block: "start" });
}
function fa(e) {
	return l(() => me(ve({ sections: e }), e.map((e) => e.slot)), [e]);
}
function pa({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = xi(n, () => ha(e));
	return /* @__PURE__ */ _(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ g(Tr, {}),
			/* @__PURE__ */ g(jt, {}),
			/* @__PURE__ */ g(st, {
				changes: i,
				hosts: r
			})
		]
	});
}
function ma(e, t, n) {
	let r = l(() => xe(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function ha(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ga(e) {
	let t = Je(e.blocks), n = new Qe(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return va(r), {
		doc: t,
		connect: () => ba(r)
	};
}
function _a(e) {
	return ga(e).connect();
}
function va(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => ya(t, n, {
		type: "update",
		update: x(e)
	})), r.on("update", (n, i) => {
		let a = S(r, e(n));
		ya(t, i, {
			type: "awareness",
			update: x(a)
		});
	});
}
function ya(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function ba(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => xa(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Sa(e, n), () => t.handlers.delete(n))
	};
}
function xa(e, t, n) {
	if (n.type === "update") {
		C(e.doc, b(n.update), t);
		return;
	}
	$e(e.awareness, b(n.update), t);
}
function Sa({ doc: e, awareness: t, meta: n }, r) {
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
}, Ca = {
	kept: " ",
	added: "+",
	removed: "-"
};
function wa({ before: e, after: t, className: n }) {
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
			/* @__PURE__ */ g(Ta, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ g(Ea, { section: e }, e.slot)),
			/* @__PURE__ */ g(Da, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Ta({ changes: e }) {
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
function Ea({ section: e }) {
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
					children: [Ca[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Da({ what: e, changes: t }) {
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
export { wa as PlanDiffView, ea as PlanEditor, xt as bypassTemplate, ga as createMemoryHub, zt as fromEditorBlocks, _a as localTransport, W as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map