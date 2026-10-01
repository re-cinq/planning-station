import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as ee, useMemo as c, useRef as l, useState as u, useSyncExternalStore as te } from "react";
import { BlockNoteView as ne } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as d, PLAN_FRAGMENT as re, applyOps as ie, changeWords as ae, diffPlans as oe, findSectionSlot as f, isPlanBlock as se, isRequiredAt as ce, newId as p, optionsOf as le, parseBlock as ue, partitionSections as de, plainText as fe, previewProposal as pe, refineInputs as me, settledBySlot as he, settledCount as ge, tableCells as _e, templateFor as ve, toBlocks as ye, toPlanDocument as be, usesOf as xe, validatePlan as Se } from "@re-cinq/planning-document";
import { createPortal as Ce } from "react-dom";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
import { offset as we } from "@floating-ui/react";
import { SideMenuExtension as Te } from "@blocknote/core/extensions";
import { SideMenu as Ee, SideMenuController as De, SuggestionMenuController as Oe, createReactBlockSpec as _, useBlockNoteEditor as v, useCreateBlockNote as ke, useEditorChange as Ae, useExtensionState as je } from "@blocknote/react";
import { BlockNoteSchema as Me, createExtension as Ne, filterSuggestionItems as Pe, insertOrUpdateBlockForSlashMenu as Fe } from "@blocknote/core";
import { Plugin as Ie, PluginKey as Le } from "prosemirror-state";
import { yCursorPluginKey as Re, ySyncPluginKey as ze } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as Be, acceptChange as Ve, acceptRefine as He, applyChangeAnyway as Ue, applyRefineAnyway as We, askRefine as Ge, changesIn as Ke, discardChange as qe, discardRefine as Je, docFromBlocks as Ye, fromBase64 as y, proposalsIn as Xe, readBlocks as Ze, staleChanges as Qe, toBase64 as b } from "@re-cinq/planning-yjs";
import { Awareness as $e, applyAwarenessUpdate as et, encodeAwarenessUpdate as x } from "y-protocols/awareness";
import { Doc as tt, applyUpdate as S, encodeStateAsUpdate as nt } from "yjs";
import { withCollaboration as rt } from "@blocknote/core/yjs";
import { Decoration as it, DecorationSet as at } from "prosemirror-view";
//#region src/blocks/adapters.ts
var ot = n({}), st = n({ user: {
	id: "",
	name: "Someone"
} });
function C() {
	return i(st);
}
var w = {
	change: "_change_1dmjt_1",
	words: "_words_1dmjt_12",
	dropped: "_dropped_1dmjt_17",
	caption: "_caption_1dmjt_31",
	stale: "_stale_1dmjt_37",
	bar: "_bar_1dmjt_43"
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
function ct({ changes: e, hosts: t }) {
	return /* @__PURE__ */ h(m, { children: e.map((e) => /* @__PURE__ */ h(lt, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function lt({ review: e, host: t }) {
	return t ? Ce(/* @__PURE__ */ h(ut, { review: e }), t) : null;
}
function ut({ review: e }) {
	return /* @__PURE__ */ g("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: w.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h(pt, {
				change: e.change,
				removes: e.removes
			}),
			e.stale && /* @__PURE__ */ h(dt, {}),
			/* @__PURE__ */ h(ft, { review: e })
		]
	});
}
function dt() {
	return /* @__PURE__ */ h("p", {
		className: w.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function ft({ review: e }) {
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
function pt({ change: e, removes: t }) {
	return t ? /* @__PURE__ */ h(mt, { removal: t }) : ae(e).map((e, t) => /* @__PURE__ */ h("p", {
		className: w.words,
		children: e
	}, t));
}
function mt({ removal: e }) {
	let t = e.takes === "section" ? "Clears" : "Removes", n = e.takes === "section" ? "section" : gt(e.type);
	return e.lines.length === 0 ? /* @__PURE__ */ h("p", {
		className: w.caption,
		children: `${t} an empty ${n}.`
	}) : /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("p", {
		className: w.caption,
		children: `${t} this ${n}:`
	}), e.lines.map((e, t) => /* @__PURE__ */ h("p", {
		className: w.dropped,
		children: /* @__PURE__ */ h("del", { children: e })
	}, t))] });
}
var ht = {
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
function gt(e) {
	return ht[e] ?? "block";
}
//#endregion
//#region src/template/template-guard.ts
var _t = "planTemplateBypass", vt = "section-heading", yt = "blockContent", bt = [
	"plan-title",
	vt,
	"section-panel",
	"section-actions"
], xt = Ne({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Ie({ filterTransaction: Ct })]
});
function St(e, t) {
	return e.setMeta(_t, t);
}
function Ct(e, t) {
	if (!e.docChanged || wt(e)) return !0;
	let n = Tt(t.doc), r = Tt(e.doc);
	return At(Dt(n), Dt(r)) && Ot(n, r);
}
function wt(e) {
	let t = e.getMeta(ze);
	return !!e.getMeta(_t) || t?.isChangeOrigin === !0;
}
function Tt(e) {
	let t = [];
	return e.descendants((e) => {
		Et(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Et(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(yt);
}
function Dt(e) {
	return e.filter((e) => bt.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function Ot(e, t) {
	return kt(t) === 0 || kt(e) > 0;
}
function kt(e) {
	let t = e.findIndex((e) => e.type === vt);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function At(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var jt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [we(({ elements: e, rects: t }) => {
		let n = Pt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Mt() {
	return /* @__PURE__ */ h(De, {
		floatingUIOptions: jt,
		sideMenu: Nt
	});
}
function Nt() {
	let e = je(Te, { selector: (e) => e?.block.type });
	return e === void 0 || bt.includes(e) ? null : /* @__PURE__ */ h(Ee, {});
}
function Pt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? Ft(t) : null;
}
function Ft(e) {
	let t = It(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function It(e) {
	let t = Lt(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Rt(n);
}
function Lt(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Rt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function zt(e) {
	return e;
}
function Bt(e) {
	return e.map(ue);
}
function E(e, t) {
	return be(Bt(e), t);
}
var D = {
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
}, Vt = { props: { resolved: !0 } }, Ht = { props: { resolved: !1 } };
function Ut({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = nn(A(e));
	return /* @__PURE__ */ g("aside", {
		className: D.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${j(e)}`,
		...Gt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ h(Kt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ h("div", {
				className: D.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ h(Wt, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Wt({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ g("div", {
		className: D.actions,
		contentEditable: !1,
		children: [k(e) && /* @__PURE__ */ h(qt, {
			block: e,
			editor: t,
			resolved: n
		}), /* @__PURE__ */ h(Jt, {
			block: e,
			editor: t
		})]
	});
}
function Gt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Kt({ block: e, resolved: t }) {
	return /* @__PURE__ */ g("p", {
		className: D.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: D.author,
				children: j(e)
			}),
			/* @__PURE__ */ h("time", {
				className: D.when,
				children: sn(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: D.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function qt({ block: e, editor: t, resolved: n }) {
	return n ? /* @__PURE__ */ h(O, {
		label: "Reopen",
		onClick: () => t.updateBlock(e, Ht)
	}) : /* @__PURE__ */ h(Qt, {
		block: e,
		editor: t
	});
}
function Jt({ block: e, editor: t }) {
	let [n, r] = u(!1), i = Zt(e);
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h(O, {
		label: "Delete",
		onClick: () => r(!0)
	}), n && /* @__PURE__ */ h(Yt, {
		question: Xt(i.length - 1),
		onConfirm: () => {
			r(!1), t.removeBlocks(i);
		},
		onCancel: () => r(!1)
	})] });
}
function Yt({ question: e, onConfirm: t, onCancel: n }) {
	return /* @__PURE__ */ g("div", {
		className: D.confirm,
		role: "dialog",
		"aria-label": e,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("p", {
				className: D.question,
				children: e
			}),
			/* @__PURE__ */ h(O, {
				label: "Delete",
				onClick: t
			}),
			/* @__PURE__ */ h(O, {
				label: "Cancel",
				onClick: n
			})
		]
	});
}
function Xt(e) {
	return e === 0 ? "Delete this comment?" : `Delete this thread and its ${e} ${e === 1 ? "reply" : "replies"}?`;
}
function Zt(e) {
	let t = v();
	if (!k(e)) return [e];
	let n = A(e);
	return t.document.filter((e) => e.type === "comment" && A(e) === n);
}
function Qt({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ g(m, { children: [n ? /* @__PURE__ */ h($t, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(O, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(O, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Vt)
	})] });
}
function O({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function $t({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = tn({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: D.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h(en, {
			to: j(e),
			draft: r,
			onDraft: i
		})
	});
}
function en({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: D.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function tn({ editor: e, block: t }) {
	let { user: n } = C(), r = v();
	return (i) => {
		if (!i) return;
		let a = A(t), o = r.document, s = an(o, a) ?? t;
		e.insertBlocks([on(a, i, n.name)], s, "after");
	};
}
function nn(e) {
	let t = v(), n = () => rn(t.document, e), [r, i] = u(n);
	return Ae(() => i(n())), r;
}
function rn(e, t) {
	return e.some((e) => k(e) && A(e) === t && e.props.resolved === !0);
}
function an(e, t) {
	return e.filter((e) => e.type === "comment" && A(e) === t).at(-1);
}
function k(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function A(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function j(e) {
	return String(e.props.author || "Someone");
}
function on(e, t, n) {
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
	return /* @__PURE__ */ g("aside", {
		className: M.finding,
		"data-kind": "finding",
		"data-severity": r,
		"data-resolved": i || void 0,
		"aria-label": dn(r),
		children: [
			/* @__PURE__ */ h(ln, {
				severity: r,
				why: String(e.props.why ?? "")
			}),
			/* @__PURE__ */ h("div", {
				className: M.text,
				ref: n
			}),
			t.isEditable && /* @__PURE__ */ h(un, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function ln({ severity: e, why: t }) {
	return /* @__PURE__ */ g("p", {
		className: M.who,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("span", {
			className: M.label,
			children: dn(e)
		}), t && /* @__PURE__ */ h("span", {
			className: M.why,
			children: t
		})]
	});
}
function un({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: M.actions,
		contentEditable: !1,
		children: /* @__PURE__ */ h("button", {
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
	let { renderMockup: t } = o(ot);
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
	let i = ee(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: P.steps,
		disabled: r
	};
	return /* @__PURE__ */ g("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ h("legend", {
			className: P.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ h(gn, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function gn({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ g("label", {
		className: P.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ h("input", {
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
	let n = ee();
	return /* @__PURE__ */ g("span", {
		className: F.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: F.label,
			htmlFor: n,
			children: vn(_n, e)
		}), /* @__PURE__ */ h(bn, {
			...t,
			id: n
		})]
	});
}
function bn(e) {
	return e.spec.values ? /* @__PURE__ */ h(xn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ h(Sn, { ...e });
}
function xn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ h("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ h("option", { children: e }, e))
	});
}
function Sn({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
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
var Cn = { maturity: hn };
function wn({ block: e, editor: t, contentRef: n }) {
	let r = pn[e.type];
	return /* @__PURE__ */ g("div", {
		className: N.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(Tn, {
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
function Tn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: N.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: N.head,
			children: [/* @__PURE__ */ h("span", {
				className: N.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ h(En, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ h(Dn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function En({ view: e, props: t }) {
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
function Dn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
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
	return /* @__PURE__ */ h("h1", {
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
	let r = le(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: I.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(jn, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: I.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ h(Mn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function jn({ why: e, picks: t, used: n }) {
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
function Mn({ block: e, editor: t, options: n }) {
	return Rn(Bn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(Nn, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ h(Fn, {
		block: e,
		editor: t
	});
}
function Nn({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ h("ul", {
		className: I.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(Pn, {
			onPick: () => Ln(t, e, n),
			children: n
		}) }, n))
	});
}
function Pn({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: I.suggestion,
		onClick: e,
		children: t
	});
}
function Fn({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ g("form", {
		className: I.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Ln(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(In, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: I.answerButton,
			children: "Answer"
		})]
	});
}
function In({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
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
	let t = v(), [n, r] = u(() => zn(t.document, e));
	return Ae(() => r(zn(t.document, e))), n;
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
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/doc-blocks.ts
var z = /* @__PURE__ */ new WeakMap();
function Hn(e) {
	let t = z.get(e);
	if (t) return t;
	let n = Ze(e);
	return z.set(e, n), e.once("update", () => z.delete(e)), n;
}
//#endregion
//#region src/session/use-section-refine.ts
function Un(e, t) {
	let n = Gn(e);
	return c(() => {
		let n = Hn(e), r = me(n, t), i = Xe(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ge(r),
			proposal: i,
			preview: i?.status === "proposed" ? pe(n, i) : void 0,
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
			uses: xe(n),
			baseHash: Ge(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void He(e, t),
		applyAnyway: () => void We(e, t),
		discard: () => Je(e, t)
	};
}
function Gn(e) {
	let [t, n] = u(0);
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
	return t.proposal ? /* @__PURE__ */ h(qn, {
		...r,
		proposal: t.proposal
	}) : /* @__PURE__ */ h(Yn, { ...r });
}
function qn({ proposal: e, ...t }) {
	switch (e.status) {
		case "asked": return /* @__PURE__ */ h(Xn, {
			...t,
			askedBy: e.askedBy
		});
		case "failed": return /* @__PURE__ */ h(Zn, {
			...t,
			reason: e.reason
		});
		default: return /* @__PURE__ */ h(Qn, {
			...t,
			proposal: e
		});
	}
}
function Jn({ slot: e, title: t }, n) {
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
function Yn({ refine: e, ask: t }) {
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
			children: n ? `uses ${nr(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Xn({ refine: e, askedBy: t }) {
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
function Zn({ refine: e, ask: t, reason: n }) {
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
function Qn({ refine: e, ask: t, title: n, proposal: r }) {
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
					rr(r)
				]
			}),
			/* @__PURE__ */ h(er, { lines: e.preview?.lines ?? [] }),
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
			/* @__PURE__ */ h($n, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function $n({ refine: e, ask: t, stale: n }) {
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
function er({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: T.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: T[e.kind],
			children: /* @__PURE__ */ h(tr, { line: e })
		}, `${t}-${e.text}`))
	});
}
function tr({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
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
	let { slot: n, title: r } = cr(e), { onRefine: i, doc: a } = C();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: or.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Kn, {
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
function ur({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = R(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(dr, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function dr({ block: e, editor: t, title: n }) {
	let { user: r } = C(), [i, a] = u("");
	return /* @__PURE__ */ g("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(pr({
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
		}), /* @__PURE__ */ h(fr, {})]
	});
}
function fr() {
	return /* @__PURE__ */ h("button", {
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
			commentId: p("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var U = { render: wn }, hr = {
	"plan-title": _(d["plan-title"], { render: kn })(),
	"section-heading": _(d["section-heading"], { render: lr })(),
	"section-panel": _(d["section-panel"], { render: ur })(),
	"section-actions": _(d["section-actions"], { render: sr })(),
	comment: _(d.comment, { render: Ut })(),
	finding: _(d.finding, { render: cn })(),
	kpi: _(d.kpi, U)(),
	prototype: _(d.prototype, U)(),
	mockup: _(d.mockup, { render: fn })(),
	question: _(d.question, { render: An })(),
	answer: _(d.answer, U)()
}, W = Me.create({ blockSpecs: {
	...Be,
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
	let e = v(W), t = o(L);
	return /* @__PURE__ */ h(Oe, {
		triggerCharacter: "/",
		getItems: async (n) => Pe(Er(e, t), n)
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
		onItemClick: () => Fe(e, zt(t))
	})) : [];
}
function Dr(e, { blocks: t, cursorId: n }) {
	let r = gr(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Or(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => kr(e, t, n));
}
function kr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ce(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Ar(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var q = {
	outline: "_outline_1b965_1",
	phase: "_phase_1b965_6",
	slots: "_slots_1b965_13",
	title: "_title_1b965_20",
	required: "_required_1b965_24",
	settled: "_settled_1b965_28",
	problems: "_problems_1b965_32",
	footer: "_footer_1b965_38"
}, jr = [], Mr = /* @__PURE__ */ new Map();
function Nr({ approval: e = null, children: t, ...n }) {
	return /* @__PURE__ */ g("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ h("p", {
				className: q.phase,
				children: e ? Fr(e) : Pr(n.report)
			}),
			/* @__PURE__ */ h(Lr, { ...n }),
			t && /* @__PURE__ */ h("div", {
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
	return /* @__PURE__ */ h("ol", {
		className: q.slots,
		children: Rr(e).map((e) => /* @__PURE__ */ h(zr, { ...e }, e.section.slot))
	});
}
function Rr({ template: e, report: t, sections: n = jr, settled: r = Mr }) {
	let i = Ar(t.problems);
	return Or(e, n, t.phase).map((e) => ({
		section: e,
		problems: i.get(e.slot) ?? [],
		settled: r.get(e.slot) ?? 0
	}));
}
function zr({ section: e, problems: t, settled: n }) {
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
			n > 0 && /* @__PURE__ */ g("span", {
				className: q.settled,
				children: [" ", Br(n)]
			}),
			/* @__PURE__ */ h("ul", {
				className: q.problems,
				children: t.map((e) => /* @__PURE__ */ h("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
function Br(e) {
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
function Vr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of [...e].sort(Hr)) t.has(n.userId) || t.set(n.userId, Wr(n.color, [...t.values()]));
	return t;
}
function Hr(e, t) {
	return Number(Ur(t)) - Number(Ur(e)) || e.joinedAt - t.joinedAt || e.clientId - t.clientId;
}
function Ur({ color: e }) {
	return e !== void 0 && X.includes(e);
}
function Wr(e, t) {
	let n = X.filter((e) => !t.includes(e));
	return e && n.includes(e) ? e : n[0] ?? X[t.length % X.length];
}
//#endregion
//#region src/presence/presence-users.ts
function Gr(e, t) {
	return [...e].flatMap(([e, n]) => e === t || !n.user ? [] : [Kr(e, n)]);
}
function Kr(e, { user: t = {}, editing: n, cursor: r }) {
	return {
		clientId: e,
		id: Z(e, t),
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? X[0]),
		slot: Xr(n),
		hasCursor: r != null
	};
}
function qr(e) {
	return [...e].flatMap(([e, { user: t }]) => t ? [Jr(e, t)] : []);
}
function Jr(e, t) {
	return {
		clientId: e,
		userId: Z(e, t),
		joinedAt: typeof t.joinedAt == "number" ? t.joinedAt : 2 ** 53 - 1,
		color: typeof t.color == "string" ? t.color : void 0
	};
}
function Yr(e, t) {
	let n = e.get(t)?.user, r = n && Vr(qr(e)).get(Z(t, n));
	return r === n?.color ? void 0 : r;
}
function Z(e, t) {
	return typeof t.id == "string" && t.id ? t.id : String(e);
}
function Xr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Zr(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/peer-cursor.ts
var Qr = "⁠";
function $r(e) {
	let t = `background-color: var(${ti(e.id ?? "")}, ${e.color}); color: white`, n = Q("bn-collaboration-cursor__label", t);
	n.append(e.name);
	let r = Q("bn-collaboration-cursor__caret", t);
	r.setAttribute("contenteditable", "false"), r.append(n);
	let i = Q("bn-collaboration-cursor__base");
	return i.append(Qr, r, Qr), i;
}
function ei(e, t) {
	t.forEach((t) => e.style.setProperty(ti(t.id), t.color));
}
function ti(e) {
	return `--ps-peer-${[...e].map(ni).join("")}`;
}
function ni(e) {
	return /[a-zA-Z0-9-]/.test(e) ? e : `_${e.codePointAt(0)}_`;
}
function Q(e, t) {
	let n = document.createElement("span");
	return n.classList.add(e), t && n.setAttribute("style", t), n;
}
//#endregion
//#region src/presence/use-presence.ts
function ri(e) {
	let [t, n] = u(() => li(e));
	return si(e, () => n(li(e))), t;
}
function ii(e, t) {
	ci(e, t), ai(t), oi(e, t);
}
function ai(e) {
	si(e, () => {
		let t = Yr(e.getStates(), e.clientID), n = e.getLocalState()?.user;
		t && e.setLocalStateField("user", {
			...n,
			color: t
		});
	});
}
function oi(e, t) {
	si(t, () => {
		let n = e.domElement;
		n && ei(n, li(t));
	});
}
function si(e, t) {
	let n = l(t);
	n.current = t, s(() => {
		let t = () => n.current();
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]);
}
function ci(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: gr(r, n.id) });
	}), [e, t]);
}
function li(e) {
	return Gr(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/Participants.tsx
function ui({ awareness: e, ...t }) {
	let n = ri(e);
	return n.length === 0 ? null : /* @__PURE__ */ h("ul", {
		className: Y.participants,
		"aria-label": "Participants",
		children: n.map((e) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(di, {
			user: e,
			...t
		}) }, e.clientId))
	});
}
function di({ user: e, template: t, titles: n, onLocate: r }) {
	let i = Zr(e, t, n);
	return e.hasCursor ? /* @__PURE__ */ h("button", {
		type: "button",
		className: Y.locate,
		"aria-description": `Go to ${e.name}'s cursor`,
		onMouseDown: fi,
		onClick: () => r(e),
		children: /* @__PURE__ */ h(pi, {
			color: e.color,
			label: i
		})
	}) : /* @__PURE__ */ h("span", {
		className: Y.away,
		children: /* @__PURE__ */ h(pi, {
			color: e.color,
			label: i
		})
	});
}
function fi(e) {
	e.preventDefault();
}
function pi({ color: e, label: t }) {
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
function mi(e, t) {
	let n = e.prosemirrorView, r = hi(n, t);
	r !== null && gi(n, r)?.scrollIntoView({ block: "center" });
}
function hi(e, t) {
	let [n] = Re.getState(e.state)?.find(void 0, void 0, (e) => e.key === String(t)) ?? [];
	return n?.from ?? null;
}
function gi(e, t) {
	let { node: n } = e.domAtPos(t);
	return n instanceof Element ? n : n.parentElement;
}
var _i = { notice: "_notice_1xdcv_1" }, vi = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function yi({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: _i.notice,
		role: "status",
		"data-status": e,
		children: [vi[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function bi(e, t) {
	let n = ji(e, t);
	return c(() => xi(e), [e, n]);
}
function xi(e) {
	let t = new Set(Qe(e).map((e) => e.changeId)), n = Hn(e);
	return Ke(e).map((r) => ({
		change: r,
		stale: t.has(r.changeId),
		removes: Ci(n, r),
		write: () => t.has(r.changeId) ? Ue(e, r.changeId) : Ve(e, r.changeId),
		discard: () => qe(e, r.changeId)
	}));
}
var Si = {
	"remove-block": wi,
	"set-section-text": Ti,
	"set-section-prose": Ti
};
function Ci(e, t) {
	let n = Si[t.op.op];
	return n && ae(t).length === 0 ? n(e, t) : void 0;
}
function wi(e, t) {
	let n = e.flatMap(Di).find((e) => e.id === t.anchorId);
	return n && {
		takes: "block",
		type: n.type,
		lines: ki(n)
	};
}
function Ti(e, { op: t, slot: n }) {
	let r = new Set(Ei(ie(e, [t]), n).map((e) => e.id));
	return {
		takes: "section",
		lines: Ei(e, n).filter((e) => !r.has(e.id)).flatMap(ki)
	};
}
function Ei(e, t) {
	return de(e).find((e) => e.slot === t)?.blocks ?? [];
}
function Di(e) {
	return [e, ...Oi(e).flatMap(Di)];
}
function Oi(e) {
	return se(e) ? [] : e.children;
}
function ki(e) {
	return [Ai(e.content), ...Oi(e).flatMap(ki)].filter(Boolean);
}
function Ai(e) {
	return Array.isArray(e) ? fe(e) : _e(e).flat().map(fe).join(" · ");
}
function ji(e, t) {
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
var Mi = "plan-transport", Ni = class extends $e {
	setLocalStateField(e, t) {
		(e !== "cursor" || t !== null) && super.setLocalStateField(e, t);
	}
};
function Pi(e) {
	let t = new tt(), n = {
		doc: t,
		awareness: new Ni(t)
	}, r = Ii({
		status: "connecting",
		meta: null
	});
	zi(n, e);
	let i = e.subscribe((e) => Ri({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Fi(n, i)
	};
}
function Fi({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Ii(e) {
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
var Li = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		S(e, y(n), Mi), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => S(e, y(t), Mi),
	awareness: ({ awareness: e }, { update: t }) => et(e, y(t), Mi),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Ri(e, t) {
	Li[t.type](e, t);
}
function zi({ doc: t, awareness: n }, r) {
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
function Bi(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = Pi(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Vi(e) {
	return te(e.onState, e.state);
}
//#endregion
//#region src/schema/change-widgets.ts
var Hi = new Le("planChangeWidgets");
function Ui(e, t) {
	return Ne({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new Ie({
			key: Hi,
			props: { decorations: (n) => at.create(n.doc, Wi(n, e, t)) }
		})]
	});
}
function Wi(e, t, n) {
	let r = Ji(e);
	return Ke(t).flatMap((e) => {
		let t = Gi(r, e);
		return t === void 0 ? [] : [Ki(t, e, n)];
	});
}
function Gi(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Ki(e, t, n) {
	return it.widget(e, () => qi(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function qi(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Ji(e) {
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
function Yi({ session: e, meta: t, user: n, onChange: r }) {
	let i = c(() => /* @__PURE__ */ new Map(), []), o = Xi(e, n, i), s = Zi(o, e, a((e) => r?.(E(e, t)), [t, r]));
	return {
		editor: o,
		plan: c(() => E(s, t), [s, t]),
		hosts: i
	};
}
function Xi(e, t, n) {
	let { doc: r } = e;
	return ke(rt({
		schema: W,
		extensions: [xt, Ui(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(re),
			user: {
				...t,
				color: "",
				joinedAt: Date.now()
			},
			provider: e,
			renderCursor: $r
		}
	}), [e]);
}
function Zi(e, t, n) {
	let [r, i] = u(() => Ze(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Qi = {};
function $i({ transport: e, adapters: t = Qi, className: n, ...r }) {
	let i = Bi(e), a = ea(r);
	return /* @__PURE__ */ h(ot, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: ta({
				...a,
				className: n
			}),
			children: i ? /* @__PURE__ */ h(na, {
				...r,
				...a,
				session: i
			}) : /* @__PURE__ */ h(yi, { status: "connecting" })
		})
	});
}
function ea({ showOutline: e = !0, showPresence: t = !0 }) {
	return {
		showOutline: e,
		showPresence: t
	};
}
function ta({ showOutline: e, showPresence: t, className: n }) {
	let r = e || t ? J.withSidebar : J.single;
	return [
		J.editor,
		r,
		"ps-editor",
		n
	].filter(Boolean).join(" ");
}
function na({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Vi(t.session);
	if (!r) return /* @__PURE__ */ h(yi, {
		status: n,
		reason: i
	});
	let a = e ?? ve(r.type);
	return /* @__PURE__ */ g(L, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ h(yi, {
			status: n,
			reason: i
		}), /* @__PURE__ */ h(ra, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ra({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: ee } = Yi(r), c = ia(i, o, ee), l = fa(s, e, t);
	return ii(o, i.awareness), /* @__PURE__ */ h(st, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(aa, {
			...r,
			...c,
			...s,
			report: l
		})
	});
}
function ia(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function aa(e) {
	let t = sa(e.sections);
	return /* @__PURE__ */ g(Vn, {
		value: t,
		children: [/* @__PURE__ */ h(da, { ...e }), /* @__PURE__ */ h(oa, {
			...e,
			titles: t
		})]
	});
}
function oa({ showPresence: e, showOutline: t, ...n }) {
	return !e && !t ? null : /* @__PURE__ */ g("aside", {
		className: J.sidebar,
		children: [e && /* @__PURE__ */ h(ca, { ...n }), t && /* @__PURE__ */ h(la, { ...n })]
	});
}
function sa(e) {
	return c(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function ca({ editor: e, awareness: t, template: n, titles: r }) {
	return /* @__PURE__ */ h(ui, {
		awareness: t,
		template: n,
		titles: r,
		onLocate: (t) => mi(e, t.clientId)
	});
}
function la({ meta: e, outlineFooter: t, ...n }) {
	let r = ua(n.sections);
	return /* @__PURE__ */ h(Nr, {
		...n,
		settled: r,
		approval: e.approval,
		children: t
	});
}
function ua(e) {
	return c(() => he(ye({ sections: e }), e.map((e) => e.slot)), [e]);
}
function da({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = bi(n, () => pa(e));
	return /* @__PURE__ */ g(ne, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ h(Tr, {}),
			/* @__PURE__ */ h(Mt, {}),
			/* @__PURE__ */ h(ct, {
				changes: i,
				hosts: r
			})
		]
	});
}
function fa(e, t, n) {
	let r = c(() => Se(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function pa(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function ma(e) {
	let t = Ye(e.blocks), n = new $e(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return ga(r), {
		doc: t,
		connect: () => va(r)
	};
}
function ha(e) {
	return ma(e).connect();
}
function ga(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => _a(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		_a(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function _a(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function va(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ya(e, t, n),
		subscribe: (n) => (t.handlers.add(n), ba(e, n), () => t.handlers.delete(n))
	};
}
function ya(e, t, n) {
	if (n.type === "update") {
		S(e.doc, y(n.update), t);
		return;
	}
	et(e.awareness, y(n.update), t);
}
function ba({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: b(nt(e))
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
}, xa = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Sa({ before: e, after: t, className: n }) {
	let r = oe(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ h(Ca, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(wa, { section: e }, e.slot)),
			/* @__PURE__ */ h(Ta, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Ca({ changes: e }) {
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
function wa({ section: e }) {
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
					children: [xa[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Ta({ what: e, changes: t }) {
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
export { Sa as PlanDiffView, $i as PlanEditor, St as bypassTemplate, ma as createMemoryHub, Bt as fromEditorBlocks, ha as localTransport, W as planSchema, E as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map