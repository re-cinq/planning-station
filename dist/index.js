import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as f } from "react";
import { BlockNoteView as p } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as m, PLAN_FRAGMENT as h, changeWords as g, diffPlans as ee, findSectionSlot as te, isRequiredAt as _, newId as v, optionsOf as ne, parseBlock as re, previewProposal as ie, refineInputs as ae, settledCount as oe, templateFor as se, toPlanDocument as ce, usesOf as le, validatePlan as ue } from "@re-cinq/planning-document";
import { createPortal as de } from "react-dom";
import { Fragment as fe, jsx as y, jsxs as b } from "react/jsx-runtime";
import { offset as pe } from "@floating-ui/react";
import { SideMenuExtension as me } from "@blocknote/core/extensions";
import { SideMenu as he, SideMenuController as ge, SuggestionMenuController as _e, createReactBlockSpec as x, useBlockNoteEditor as ve, useCreateBlockNote as ye, useEditorChange as be, useExtensionState as xe } from "@blocknote/react";
import { BlockNoteSchema as Se, createExtension as Ce, filterSuggestionItems as we, insertOrUpdateBlockForSlashMenu as Te } from "@blocknote/core";
import { AllSelection as Ee, NodeSelection as S, Plugin as De, PluginKey as Oe, Selection as ke, TextSelection as C } from "prosemirror-state";
import { ySyncPluginKey as Ae } from "y-prosemirror";
import { PROSE_BLOCK_SPECS as je, acceptChange as Me, acceptRefine as Ne, applyChangeAnyway as Pe, applyRefineAnyway as Fe, askRefine as Ie, changesIn as Le, discardChange as Re, discardRefine as ze, docFromBlocks as Be, fromBase64 as Ve, proposalsIn as He, readBlocks as Ue, staleChanges as We, toBase64 as Ge } from "@re-cinq/planning-yjs";
import { Awareness as Ke, applyAwarenessUpdate as qe, encodeAwarenessUpdate as Je } from "y-protocols/awareness";
import { Doc as Ye, applyUpdate as Xe, encodeStateAsUpdate as Ze } from "yjs";
import { withCollaboration as Qe } from "@blocknote/core/yjs";
import { DOMParser as $e, DOMSerializer as et, Fragment as w, Mark as tt, ReplaceError as nt, Slice as T } from "prosemirror-model";
//#region src/blocks/adapters.ts
var rt = n({}), it = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function at() {
	return i(it);
}
var ot = {
	change: "_change_zymrw_1",
	words: "_words_zymrw_12",
	dropped: "_dropped_zymrw_17",
	who: "_who_zymrw_23",
	stale: "_stale_zymrw_29",
	bar: "_bar_zymrw_35"
}, E = {
	bar: "_bar_1g503_1",
	note: "_note_1g503_9",
	refine: "_refine_1g503_14",
	quiet: "_quiet_1g503_38",
	proposal: "_proposal_1g503_54",
	stale: "_stale_1g503_64",
	lines: "_lines_1g503_70",
	kept: "_kept_1g503_78",
	added: "_added_1g503_82",
	removed: "_removed_1g503_86"
};
//#endregion
//#region src/blocks/InlineChanges.tsx
function st({ changes: e, hosts: t }) {
	return /* @__PURE__ */ y(fe, { children: e.map((e) => /* @__PURE__ */ y(ct, {
		review: e,
		host: t.get(e.change.changeId)
	}, e.change.changeId)) });
}
function ct({ review: e, host: t }) {
	return t ? de(/* @__PURE__ */ y(lt, { review: e }), t) : null;
}
function lt({ review: e }) {
	return /* @__PURE__ */ b("div", {
		role: "group",
		"aria-label": "Proposed change",
		className: ot.change,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ y(ft, { change: e.change }),
			e.stale && /* @__PURE__ */ y(ut, {}),
			/* @__PURE__ */ y(dt, { review: e })
		]
	});
}
function ut() {
	return /* @__PURE__ */ y("p", {
		className: ot.stale,
		role: "alert",
		children: "This paragraph changed after the agent read it."
	});
}
function dt({ review: e }) {
	return /* @__PURE__ */ b("p", {
		className: ot.bar,
		children: [/* @__PURE__ */ y("button", {
			type: "button",
			className: E.refine,
			onClick: e.write,
			children: e.stale ? "Apply anyway" : "Accept"
		}), /* @__PURE__ */ y("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function ft({ change: e }) {
	let t = g(e);
	return t.length > 0 ? t.map((e, t) => /* @__PURE__ */ y("p", {
		className: ot.words,
		children: e
	}, t)) : /* @__PURE__ */ y("p", {
		className: ot.dropped,
		children: "This paragraph goes."
	});
}
//#endregion
//#region src/template/template-guard.ts
var pt = "planTemplateBypass", mt = "section-heading", ht = "blockContent", gt = [
	"plan-title",
	mt,
	"section-panel",
	"section-actions"
], _t = Ce({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new De({ filterTransaction: yt })]
});
function vt(e, t) {
	return e.setMeta(pt, t);
}
function yt(e, t) {
	if (!e.docChanged || bt(e)) return !0;
	let n = xt(t.doc), r = xt(e.doc);
	return Et(Ct(n), Ct(r)) && wt(n, r);
}
function bt(e) {
	let t = e.getMeta(Ae);
	return !!e.getMeta(pt) || t?.isChangeOrigin === !0;
}
function xt(e) {
	let t = [];
	return e.descendants((e) => {
		St(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function St(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(ht);
}
function Ct(e) {
	return e.filter((e) => gt.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function wt(e, t) {
	return Tt(t) === 0 || Tt(e) > 0;
}
function Tt(e) {
	let t = e.findIndex((e) => e.type === mt);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Et(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Dt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [pe(({ elements: e, rects: t }) => {
		let n = At(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Ot() {
	return /* @__PURE__ */ y(ge, {
		floatingUIOptions: Dt,
		sideMenu: kt
	});
}
function kt() {
	let e = xe(me, { selector: (e) => e?.block.type });
	return e === void 0 || gt.includes(e) ? null : /* @__PURE__ */ y(he, {});
}
function At(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? jt(t) : null;
}
function jt(e) {
	let t = Mt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Mt(e) {
	let t = Nt(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && Pt(n);
}
function Nt(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function Pt(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Ft(e) {
	return e;
}
function It(e) {
	return e.map(re);
}
function Lt(e, t) {
	return ce(It(e), t);
}
var D = {
	comment: "_comment_xr1pj_1",
	text: "_text_xr1pj_23",
	who: "_who_xr1pj_27",
	author: "_author_xr1pj_36",
	when: "_when_xr1pj_40",
	badge: "_badge_xr1pj_44",
	actions: "_actions_xr1pj_54",
	reply: "_reply_xr1pj_78",
	input: "_input_xr1pj_82"
}, Rt = { props: { resolved: !0 } }, zt = { props: { resolved: !1 } };
function Bt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = Yt($t(e));
	return /* @__PURE__ */ b("aside", {
		className: D.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${en(e)}`,
		...Vt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ y(Ht, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ y("div", {
				className: D.text,
				ref: n
			}),
			!r && t.isEditable && /* @__PURE__ */ y(Ut, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Vt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Ht({ block: e, resolved: t }) {
	return /* @__PURE__ */ b("p", {
		className: D.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ y("span", {
				className: D.author,
				children: en(e)
			}),
			/* @__PURE__ */ y("time", {
				className: D.when,
				children: nn(e.props.at)
			}),
			t && /* @__PURE__ */ y("span", {
				className: D.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Ut({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ y("div", {
		className: D.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ y(Gt, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, zt)
		}) : /* @__PURE__ */ y(Wt, {
			block: e,
			editor: t
		})
	});
}
function Wt({ block: e, editor: t }) {
	let [n, r] = d(!1);
	return /* @__PURE__ */ b(fe, { children: [n ? /* @__PURE__ */ y(Kt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ y(Gt, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ y(Gt, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Rt)
	})] });
}
function Gt({ label: e, onClick: t }) {
	return /* @__PURE__ */ y("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Kt({ block: e, editor: t, onDone: n }) {
	let [r, i] = d(""), a = Jt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ y("form", {
		className: D.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ y(qt, {
			to: en(e),
			draft: r,
			onDraft: i
		})
	});
}
function qt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ y("input", {
		className: D.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function Jt({ editor: e, block: t }) {
	let { user: n } = at(), r = ve();
	return (i) => {
		if (!i) return;
		let a = $t(t), o = r.document, s = Zt(o, a) ?? t;
		e.insertBlocks([tn(a, i, n.name)], s, "after");
	};
}
function Yt(e) {
	let t = ve(), n = () => Xt(t.document, e), [r, i] = d(n);
	return be(() => i(n())), r;
}
function Xt(e, t) {
	return e.some((e) => Qt(e) && $t(e) === t && e.props.resolved === !0);
}
function Zt(e, t) {
	return e.filter((e) => e.type === "comment" && $t(e) === t).at(-1);
}
function Qt(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function $t(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function en(e) {
	return String(e.props.author || "Someone");
}
function tn(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: v("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function nn(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var rn = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function an({ block: e }) {
	let { renderMockup: t } = o(rt);
	return /* @__PURE__ */ b("figure", {
		className: rn.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ b("figcaption", {
			className: rn.label,
			children: [
				"Mockup (",
				e.props.format,
				")"
			]
		}), t ? t(e.props) : /* @__PURE__ */ y("p", { children: "The host renders mockups; none is configured." })]
	});
}
//#endregion
//#region src/blocks/block-views.ts
var on = {
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
}, sn = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, cn = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function ln({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: sn.steps,
		disabled: r
	};
	return /* @__PURE__ */ b("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ y("legend", {
			className: sn.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ y(un, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function un({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ b("label", {
		className: sn.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ y("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), cn[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var dn = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function fn(e, t) {
	return e[String(t)] ?? String(t);
}
var pn = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function mn({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ b("span", {
		className: pn.field,
		"data-field": e,
		children: [/* @__PURE__ */ y("label", {
			className: pn.label,
			htmlFor: n,
			children: fn(dn, e)
		}), /* @__PURE__ */ y(hn, {
			...t,
			id: n
		})]
	});
}
function hn(e) {
	return e.spec.values ? /* @__PURE__ */ y(gn, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ y(_n, { ...e });
}
function gn({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ y("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ y("option", { children: e }, e))
	});
}
function _n({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ y("input", {
		id: e,
		className: pn.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var vn = { maturity: ln };
function yn({ block: e, editor: t, contentRef: n }) {
	let r = on[e.type];
	return /* @__PURE__ */ b("div", {
		className: rn.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ y(bn, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ y("div", {
			className: rn.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function bn({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ b("div", {
		className: rn.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ b("p", {
			className: rn.head,
			children: [/* @__PURE__ */ y("span", {
				className: rn.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ y(xn, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ y(Sn, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function xn({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ b("a", {
		className: rn.link,
		href: n,
		target: "_blank",
		rel: "noreferrer",
		children: [
			e.link?.text,
			" ",
			/* @__PURE__ */ y("span", {
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function Sn({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = m[e.type], o = a;
	return r(vn[n] ?? mn, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Cn = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function wn({ contentRef: e }) {
	return /* @__PURE__ */ y("h1", {
		className: Cn.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var O = {
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
function Tn({ block: e, editor: t, contentRef: n }) {
	let r = ne(e.props.options);
	return /* @__PURE__ */ b("div", {
		className: O.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ y(En, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ y("div", {
				className: O.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ y(Dn, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function En({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ y("p", {
		className: O.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ y("span", {
			className: O.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ b("p", {
		className: O.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ y("span", {
				className: O.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ y("span", {
				className: O.why,
				children: e
			}),
			/* @__PURE__ */ y("span", {
				className: O.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Dn({ block: e, editor: t, options: n }) {
	return Nn(Fn(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ y(On, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ y(An, {
		block: e,
		editor: t
	});
}
function On({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ y("ul", {
		className: O.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ y("li", { children: /* @__PURE__ */ y(kn, {
			onPick: () => Mn(t, e, n),
			children: n
		}) }, n))
	});
}
function kn({ onPick: e, children: t }) {
	return /* @__PURE__ */ y("button", {
		type: "button",
		className: O.suggestion,
		onClick: e,
		children: t
	});
}
function An({ block: e, editor: t }) {
	let [n, r] = d("");
	return /* @__PURE__ */ b("form", {
		className: O.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Mn(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ y(jn, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ y("button", {
			type: "submit",
			className: O.answerButton,
			children: "Answer"
		})]
	});
}
function jn({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ y("input", {
		className: O.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Mn(e, t, n) {
	if (!n) return;
	let r = Fn(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Nn(e) {
	let t = ve(), [n, r] = d(() => Pn(t.document, e));
	return be(() => r(Pn(t.document, e))), n;
}
function Pn(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Fn(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var In = n(null), Ln = n(/* @__PURE__ */ new Map());
function Rn(e) {
	let t = o(In), n = o(Ln).get(e);
	return t ? te(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var zn = /* @__PURE__ */ new WeakMap();
function Bn(e, t) {
	let n = Hn(e);
	return l(() => {
		let n = Un(e), r = ae(n, t), i = He(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: oe(r),
			proposal: i,
			preview: i?.status === "proposed" ? ie(n, i) : void 0,
			...Vn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Vn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: le(n),
			baseHash: Ie(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Ne(e, t),
		applyAnyway: () => void Fe(e, t),
		discard: () => ze(e, t)
	};
}
function Hn(e) {
	let [t, n] = d(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function Un(e) {
	let t = zn.get(e);
	if (t) return t;
	let n = Ue(e);
	return zn.set(e, n), e.once("update", () => zn.delete(e)), n;
}
//#endregion
//#region src/blocks/RefineControls.tsx
function Wn(e) {
	let t = Bn(e.doc, e.slot), n = Gn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ y(Jn, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ y(qn, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ y(Kn, { ...r });
}
function Gn({ slot: e, title: t }, n) {
	let { user: r, onRefine: i } = at();
	return () => {
		let a = n.ask(r.name);
		i?.({
			slot: e,
			title: t,
			...a
		}).catch(() => n.discard());
	};
}
function Kn({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ b("p", {
		className: E.bar,
		children: [/* @__PURE__ */ y("button", {
			type: "button",
			className: E.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ y("span", {
			className: E.note,
			children: n ? `uses ${$n(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function qn({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ b("p", {
		className: E.bar,
		role: "status",
		children: [/* @__PURE__ */ b("span", {
			className: E.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ y("button", {
			type: "button",
			className: E.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Jn({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ b("section", {
		className: E.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ b("p", {
				className: E.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					er(r)
				]
			}),
			/* @__PURE__ */ y(Zn, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ b("p", {
				className: E.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ y(Yn, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function Yn({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ b("p", {
		className: E.bar,
		children: [
			/* @__PURE__ */ y("button", {
				type: "button",
				className: E.refine,
				onClick: i,
				children: r
			}),
			n && /* @__PURE__ */ y(Xn, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ y(Xn, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function Xn({ label: e, run: t }) {
	return /* @__PURE__ */ y("button", {
		type: "button",
		className: E.quiet,
		onClick: t,
		children: e
	});
}
function Zn({ lines: e }) {
	return /* @__PURE__ */ y("ul", {
		className: E.lines,
		children: e.map((e, t) => /* @__PURE__ */ y("li", {
			className: E[e.kind],
			children: /* @__PURE__ */ y(Qn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function Qn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ y("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ y("del", { children: e.text }) : e.text;
}
function $n({ inputs: e }) {
	return tr(e.answered.length, e.resolved.length);
}
function er({ uses: e }) {
	let t = tr(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function tr(e, t) {
	return [nr(e, "answer"), nr(t, "resolved thread")].filter(Boolean).join(", ");
}
function nr(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var rr = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function ir({ block: e, editor: t }) {
	let { slot: n, title: r } = ar(e), { onRefine: i, doc: a } = at();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ y("div", {
		role: "group",
		className: rr.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ y(Wn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function ar(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: Rn(t)?.title ?? t
	};
}
var or = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function sr({ block: e }) {
	let t = Rn(e.props.slot);
	return /* @__PURE__ */ b("header", {
		className: or.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ y("h2", {
			className: or.title,
			children: e.props.title
		}), t && /* @__PURE__ */ y("p", {
			className: or.hint,
			children: t.hint
		})]
	});
}
var cr = {
	panel: "_panel_1ajor_1",
	commentBox: "_commentBox_1ajor_11",
	input: "_input_1ajor_17",
	send: "_send_1ajor_34"
};
//#endregion
//#region src/blocks/SectionPanel.tsx
function lr({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = Rn(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ y("aside", {
		className: cr.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ y(ur, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function ur({ block: e, editor: t, title: n }) {
	let { user: r } = at(), [i, a] = d("");
	return /* @__PURE__ */ b("form", {
		className: cr.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(fr({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ y("input", {
			className: cr.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ y(dr, {})]
	});
}
function dr() {
	return /* @__PURE__ */ y("button", {
		type: "submit",
		className: cr.send,
		children: "Comment"
	});
}
function fr({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([pr(n, r)], e, "before"), "");
}
function pr(e, t) {
	return {
		type: "comment",
		props: {
			commentId: v("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var mr = { render: yn }, hr = {
	"plan-title": x(m["plan-title"], { render: wn })(),
	"section-heading": x(m["section-heading"], { render: sr })(),
	"section-panel": x(m["section-panel"], { render: lr })(),
	"section-actions": x(m["section-actions"], { render: ir })(),
	comment: x(m.comment, { render: Bt })(),
	kpi: x(m.kpi, mr)(),
	prototype: x(m.prototype, mr)(),
	mockup: x(m.mockup, { render: an })(),
	question: x(m.question, { render: Tn })(),
	answer: x(m.answer, mr)()
}, gr = Se.create({ blockSpecs: {
	...je,
	...hr
} });
//#endregion
//#region src/menu/section-context.ts
function _r(e, t) {
	let [n] = yr(e, t);
	return n ? String(n.props.slot) : null;
}
function vr(e, t) {
	let n = yr(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function yr(e, t) {
	let n = e.slice(0, br(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function br(e, t) {
	return e.findIndex((e) => xr(e, t));
}
function xr(e, t) {
	return e.id === t || e.children.some((e) => xr(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var k = "Text", Sr = "Plan", Cr = { cells: [
	"",
	"",
	""
] }, wr = [
	{
		kind: "paragraph",
		title: "Paragraph",
		group: k,
		aliases: ["p"]
	},
	{
		kind: "heading",
		title: "Heading",
		group: k,
		aliases: ["h2"],
		props: () => ({ level: 2 })
	},
	{
		kind: "heading",
		title: "Subheading",
		group: k,
		aliases: ["h3"],
		props: () => ({ level: 3 })
	},
	{
		kind: "bulletListItem",
		title: "Bullet list",
		group: k,
		aliases: ["ul"]
	},
	{
		kind: "numberedListItem",
		title: "Numbered list",
		group: k,
		aliases: ["ol"]
	},
	{
		kind: "checkListItem",
		title: "Checklist",
		group: k,
		aliases: ["todo"]
	},
	{
		kind: "quote",
		title: "Quote",
		group: k
	},
	{
		kind: "codeBlock",
		title: "Code",
		group: k
	},
	{
		kind: "table",
		title: "Table",
		group: k,
		content: {
			type: "tableContent",
			rows: [Cr, Cr]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: Sr,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: v("kpi") })
	},
	{
		kind: "prototype",
		title: "Prototype",
		group: Sr
	},
	{
		kind: "mockup",
		title: "Mockup",
		group: Sr
	},
	{
		kind: "question",
		title: "Question",
		group: Sr,
		props: () => ({ questionId: v("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: Sr,
		props: (e) => {
			let t = vr(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Tr(e, t) {
	return wr.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Er(e, t));
}
function Er(e, t) {
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
function Dr() {
	let e = ve(gr), t = o(In);
	return /* @__PURE__ */ y(_e, {
		triggerCharacter: "/",
		getItems: async (n) => we(Or(e, t), n)
	});
}
function Or(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && kr(t, i);
	return a ? Tr(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Te(e, Ft(t))
	})) : [];
}
function kr(e, { blocks: t, cursorId: n }) {
	let r = _r(t, n);
	return r === null ? void 0 : te(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Ar(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => jr(e, t, n));
}
function jr(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && _(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Mr(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var Nr = {
	outline: "_outline_juazx_1",
	phase: "_phase_juazx_8",
	slots: "_slots_juazx_15",
	title: "_title_juazx_22",
	required: "_required_juazx_26",
	problems: "_problems_juazx_30",
	footer: "_footer_juazx_36"
}, Pr = [];
function Fr({ template: e, report: t, sections: n = Pr, children: r }) {
	return /* @__PURE__ */ b("nav", {
		className: Nr.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ b("p", {
				className: Nr.phase,
				children: [
					t.passed ? "Ready for" : "Not ready for",
					" ",
					t.phase
				]
			}),
			/* @__PURE__ */ y(Ir, {
				template: e,
				report: t,
				sections: n
			}),
			r && /* @__PURE__ */ y("div", {
				className: Nr.footer,
				children: r
			})
		]
	});
}
function Ir({ template: e, report: t, sections: n }) {
	let r = Mr(t.problems);
	return /* @__PURE__ */ y("ol", {
		className: Nr.slots,
		children: Ar(e, n, t.phase).map((e) => /* @__PURE__ */ y(Lr, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Lr({ section: e, problems: t }) {
	return /* @__PURE__ */ b("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ y("span", {
				className: Nr.title,
				children: e.title
			}),
			e.required && /* @__PURE__ */ y("span", {
				className: Nr.required,
				children: " required"
			}),
			/* @__PURE__ */ y("ul", {
				className: Nr.problems,
				children: t.map((e) => /* @__PURE__ */ y("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var Rr = {
	editor: "_editor_o6zst_1",
	withOutline: "_withOutline_o6zst_9",
	single: "_single_o6zst_13"
}, zr = {
	bar: "_bar_xsz4f_1",
	user: "_user_xsz4f_14",
	dot: "_dot_xsz4f_20"
};
//#endregion
//#region src/presence/presence-users.ts
function Br(e, t) {
	return [...e].flatMap(([e, { user: n, editing: r }]) => e === t || !n ? [] : [Vr(e, n, r)]);
}
function Vr(e, t, n) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: Hr(n)
	};
}
function Hr(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Ur(e, t, n) {
	let r = e.slot && te(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function Wr(e) {
	let [t, n] = d(() => Kr(e));
	return s(() => {
		let t = () => n(Kr(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function Gr(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: _r(r, n.id) });
	}), [e, t]);
}
function Kr(e) {
	return Br(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/PresenceBar.tsx
function qr({ awareness: e, template: t, titles: n }) {
	let r = Wr(e);
	return /* @__PURE__ */ y("ul", {
		className: zr.bar,
		"aria-label": "Also editing",
		children: r.map((e) => /* @__PURE__ */ b("li", {
			className: zr.user,
			children: [/* @__PURE__ */ y("svg", {
				className: zr.dot,
				viewBox: "0 0 2 2",
				"aria-hidden": "true",
				children: /* @__PURE__ */ y("circle", {
					cx: "1",
					cy: "1",
					r: "1",
					fill: e.color
				})
			}), Ur(e, t, n)]
		}, e.clientId))
	});
}
var Jr = { notice: "_notice_1xdcv_1" }, Yr = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Xr({ status: e, reason: t }) {
	return /* @__PURE__ */ b("p", {
		className: Jr.notice,
		role: "status",
		"data-status": e,
		children: [Yr[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/use-plan-changes.ts
function Zr(e, t) {
	let n = $r(e, t);
	return l(() => Qr(e), [e, n]);
}
function Qr(e) {
	let t = new Set(We(e).map((e) => e.changeId));
	return Le(e).map((n) => ({
		change: n,
		stale: t.has(n.changeId),
		write: () => t.has(n.changeId) ? Pe(e, n.changeId) : Me(e, n.changeId),
		discard: () => Re(e, n.changeId)
	}));
}
function $r(e, t) {
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
var ei = "plan-transport";
function ti(e) {
	let t = new Ye(), n = {
		doc: t,
		awareness: new Ke(t)
	}, r = ri({
		status: "connecting",
		meta: null
	});
	oi(n, e);
	let i = e.subscribe((e) => ai({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => ni(n, i)
	};
}
function ni({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function ri(e) {
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
var ii = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		Xe(e, Ve(n), ei), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => Xe(e, Ve(t), ei),
	awareness: ({ awareness: e }, { update: t }) => qe(e, Ve(t), ei),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function ai(e, t) {
	ii[t.type](e, t);
}
function oi({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: Ge(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = Je(n, e(t));
		r.send({
			type: "awareness",
			update: Ge(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function si(e) {
	let [t, n] = d(null);
	return s(() => {
		let t = ti(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function ci(e) {
	return f(e.onState, e.state);
}
//#endregion
//#region ../../node_modules/prosemirror-transform/dist/index.js
var li = 65535, ui = 2 ** 16;
function di(e, t) {
	return e + t * ui;
}
function fi(e) {
	return e & li;
}
function pi(e) {
	return (e - (e & li)) / ui;
}
var mi = 1, hi = 2, gi = 4, _i = 8, vi = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & _i) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & gi) > 0;
	}
}, yi = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = fi(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + pi(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : di(o / 3, e - s), f = e == s ? hi : e == u ? mi : gi;
				return (t < 0 ? e != s : e != u) && (f |= _i), new vi(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new vi(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = fi(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
yi.empty = new yi([]);
var bi = Object.create(null), A = class {
	getMap() {
		return yi.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = bi[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in bi) throw RangeError("Duplicate use of step JSON ID " + e);
		return bi[e] = t, t.prototype.jsonID = e, t;
	}
}, j = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof nt) return e.fail(t.message);
			throw t;
		}
	}
};
function xi(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(xi(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return w.fromArray(r);
}
var Si = class e extends A {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new T(xi(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return j.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new Ci(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
A.jsonID("addMark", Si);
var Ci = class e extends A {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new T(xi(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return j.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Si(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
A.jsonID("removeMark", Ci);
var wi = class e extends A {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return j.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return j.fromReplace(e, this.pos, this.pos + 1, new T(w.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new Ti(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
A.jsonID("addNodeMark", wi);
var Ti = class e extends A {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return j.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return j.fromReplace(e, this.pos, this.pos + 1, new T(w.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new wi(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
A.jsonID("removeNodeMark", Ti);
var Ei = class e extends A {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Oi(e, this.from, this.to) ? j.fail("Structure replace would overwrite content") : j.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new yi([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? T.empty : new T(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		}
		if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? T.empty : new T(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		}
		return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, T.fromJSON(t, n.slice), !!n.structure);
	}
};
Ei.MAP_BIAS = 1, A.jsonID("replace", Ei);
var Di = class e extends A {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Oi(e, this.from, this.gapFrom) || Oi(e, this.gapTo, this.to))) return j.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return j.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? j.fromReplace(e, this.from, this.to, n) : j.fail("Content does not fit in gap");
	}
	getMap() {
		return new yi([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, T.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
A.jsonID("replaceAround", Di);
function Oi(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function ki(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
var Ai = class e extends A {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return j.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return j.fromReplace(e, this.pos, this.pos + 1, new T(w.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return yi.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
A.jsonID("attr", Ai);
var ji = class e extends A {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return j.ok(n);
	}
	getMap() {
		return yi.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
A.jsonID("docAttr", ji);
var Mi = class extends Error {};
Mi = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, Mi.prototype = Object.create(Error.prototype), Mi.prototype.constructor = Mi, Mi.prototype.name = "TransformError";
//#endregion
//#region ../../node_modules/prosemirror-view/dist/index.js
var M = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, Ni = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, Pi = null, N = function(e, t, n) {
	let r = Pi ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Fi = function() {
	Pi = null;
}, Ii = function(e, t, n, r) {
	return n && (Ri(e, t, n, r, -1) || Ri(e, t, n, r, 1));
}, Li = /^(img|br|input|textarea|hr)$/i;
function Ri(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : P(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || Hi(e) || Li.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = M(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") {
				if (n.pmViewDesc?.ignoreForSelection) t += i;
				else return !1;
			} else e = n, t = i < 0 ? P(e) : 0;
		} else return !1;
	}
}
function P(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function zi(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = P(e);
		} else if (e.parentNode && !Hi(e)) t = M(e), e = e.parentNode;
		else return null;
	}
}
function Bi(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !Hi(e)) t = M(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Vi(e, t, n) {
	for (let r = t == 0, i = t == P(e); r || i;) {
		if (e == n) return !0;
		let t = M(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == P(e);
	}
}
function Hi(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Ui = function(e) {
	return e.focusNode && Ii(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function Wi(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Gi(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Ki(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(P(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(P(r.startContainer), r.startOffset)
		};
	}
}
var F = typeof navigator < "u" ? navigator : null, qi = typeof document < "u" ? document : null, I = F && F.userAgent || "", Ji = /Edge\/(\d+)/.exec(I), Yi = /MSIE \d/.exec(I), Xi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(I), L = !!(Yi || Xi || Ji), Zi = Yi ? document.documentMode : Xi ? +Xi[1] : Ji ? +Ji[1] : 0, R = !L && /gecko\/(\d+)/i.test(I);
R && +(/Firefox\/(\d+)/.exec(I) || [0, 0])[1];
var Qi = !L && /Chrome\/(\d+)/.exec(I), z = !!Qi, $i = Qi ? +Qi[1] : 0, B = !L && !!F && /Apple Computer/.test(F.vendor), ea = B && (/Mobile\/\w+/.test(I) || !!F && F.maxTouchPoints > 2), V = ea || (F ? /Mac/.test(F.platform) : !1), ta = F ? /Win/.test(F.platform) : !1, H = /Android \d/.test(I), na = !!qi && "webkitFontSmoothing" in qi.documentElement.style, ra = na ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function ia(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function U(e, t) {
	return typeof e == "number" ? e : e[t];
}
function aa(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function oa(e, t, n) {
	if (!xa(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = Ni(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? ia(a) : aa(e), c = 0, l = 0;
		if (t.top < s.top + U(r, "top") ? l = -(s.top - t.top + U(i, "top")) : t.bottom > s.bottom - U(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + U(i, "top") - s.top : t.bottom - s.bottom + U(i, "bottom")), t.left < s.left + U(r, "left") ? c = -(s.left - t.left + U(i, "left")) : t.right > s.right - U(r, "right") && (c = t.right - s.right + U(i, "right")), c || l) {
			if (n) a.defaultView.scrollBy(c, l);
			else {
				let n = e.scrollLeft, r = e.scrollTop;
				l && (e.scrollTop += l), c && (e.scrollLeft += c);
				let i = e.scrollLeft - n, a = e.scrollTop - r;
				t = {
					left: t.left - i,
					top: t.top - a,
					right: t.right - i,
					bottom: t.bottom - a
				};
			}
		}
		let u = n ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(u)) break;
		o = u == "absolute" ? o.offsetParent : Ni(o);
	}
}
function sa(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: ca(e.dom)
	};
}
function ca(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = Ni(r));
	return t;
}
function la({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	ua(n, r == 0 ? 0 : r - t);
}
function ua(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var da = null;
function fa(e) {
	if (e.setActive) return e.setActive();
	if (da) return e.focus(da);
	let t = ca(e);
	e.focus(da == null ? { get preventScroll() {
		return da = { preventScroll: !0 }, !0;
	} } : void 0), da || (da = !1, ua(t, 0));
}
function pa(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = N(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && n.nodeType == 3 ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, u.nodeType == 1 && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? ma(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : pa(n, i);
}
function ma(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = W(r, 1);
		if (n.top != n.bottom && ha(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function ha(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function ga(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function _a(e, t, n) {
	let { node: r, offset: i } = pa(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function va(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function ya(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (ha(t, i)) return ya(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function ba(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Ki(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!ha(t, n) || (o = ya(e.dom, t, n), !o)) return null;
	}
	if (B) for (let e = o; r && e; e = Ni(e)) e.draggable && (r = void 0);
	if (o = ga(o, t), r) {
		if (R && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		na && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = va(e, r, i, t));
	}
	s ??= _a(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function xa(e) {
	return e.top < e.bottom || e.left < e.right;
}
function W(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (xa(e)) return e;
	}
	return Array.prototype.find.call(n, xa) || e.getBoundingClientRect();
}
var Sa = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Ca(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = na || R;
	if (r.nodeType == 3) {
		if (o && (Sa.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
			let e = W(N(r, i, i), n);
			if (R && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
				let t = W(N(r, i - 1, i - 1), -1);
				if (t.top == e.top) {
					let n = W(N(r, i, i + 1), -1);
					if (n.top != e.top) return wa(n, n.left < t.left);
				}
			}
			return e;
		}
		{
			let e = i, t = i, a = n < 0 ? 1 : -1;
			return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, wa(W(N(r, e, t), a), a < 0);
		}
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == P(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return Ta(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < P(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return Ta(e.getBoundingClientRect(), !0);
		}
		return Ta(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == P(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? N(e, P(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return wa(W(t, 1), !1);
	}
	if (a == null && i < P(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? N(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return wa(W(t, -1), !0);
	}
	return wa(W(r.nodeType == 3 ? N(r) : r, -n), n >= 0);
}
function wa(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function Ta(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Ea(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Da(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Ea(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = Ca(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = N(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Oa = /[\u0590-\u08ac]/;
function ka(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Oa.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Ea(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var Aa = null, ja = null, Ma = !1;
function Na(e, t, n) {
	return Aa == t && ja == n ? Ma : (Aa = t, ja = n, Ma = n == "up" || n == "down" ? Da(e, t, n) : ka(e, t, n));
}
var G = 0, Pa = 1, Fa = 2, K = 3, Ia = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = G, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule(e) {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
		}
	}
	get posBefore() {
		return this.parent.posBeforeChild(this);
	}
	get posAtStart() {
		return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
	}
	get posAfter() {
		return this.posBefore + this.size;
	}
	get posAtEnd() {
		return this.posAtStart + this.size - 2 * this.border;
	}
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)) {
			if (n < 0) {
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t - 1];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.previousSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
				return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
			}
			{
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.nextSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
				return n ? this.posBeforeChild(r) : this.posAtEnd;
			}
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > M(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = e.compareDocumentPosition(this.contentDOM) & 2;
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return r ?? n > 0 ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) {
				if (n && (a = i.nodeDOM) && !(a.nodeType == 1 ? a.contains(e.nodeType == 1 ? e : e.parentNode) : a == e)) n = !1;
				else return i;
			}
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e || i instanceof Ua) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof La && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, e && e.dom.parentNode != this.contentDOM; n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? M(e.dom) + 1 : 0
			};
		}
		{
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, e && e.dom.parentNode != this.contentDOM; n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? M(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = M(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = M(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (t.nodeType != 1 || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((R || B) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: M(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (R && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && B) && Ii(o.node, o.offset, l.anchorNode, l.anchorOffset) && Ii(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && R)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? Fa : Pa, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = K : i.markDirty(e - r, t - r);
					return;
				}
				i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Fa : K;
			}
			n = a;
		}
		this.dirty = Fa;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Fa : Pa;
			t.dirty < n && (t.dirty = n);
		}
	}
	get domAtom() {
		return !1;
	}
	get ignoreForCoords() {
		return !1;
	}
	get ignoreForSelection() {
		return !1;
	}
	isText(e) {
		return !1;
	}
}, La = class extends Ia {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			if (a.nodeType != 1) {
				let e = document.createElement("span");
				e.appendChild(a), a = e;
			}
			a.hasAttribute("contenteditable") || (a.contentEditable = "false"), a.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == G && e.type.eq(this.widget.type);
	}
	parseRule() {
		return { ignore: !0 };
	}
	stopEvent(e) {
		let t = this.widget.spec.stopEvent;
		return t ? t(e) : !1;
	}
	ignoreMutation(e) {
		return e.type != "selection" || this.widget.spec.ignoreSelection;
	}
	destroy() {
		this.widget.type.destroy(this.dom), super.destroy();
	}
	get domAtom() {
		return !0;
	}
	get ignoreForSelection() {
		return !!this.widget.type.spec.relaxedSide;
	}
	get side() {
		return this.widget.type.side;
	}
}, Ra = class extends Ia {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, za = class e extends Ia {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = et.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & K || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != K && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != G) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = G;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = oo(a, n, o, r)), t > 0 && (a = oo(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, Ba = class e extends Ia {
	constructor(e, t, n, r, i, a, o) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (u.nodeType != 3) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = et.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = Za(u, r, n), l ? c = new Wa(t, n, r, i, u, d || null, f, l) : n.isText ? new Ha(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
	}
	parseRule(e) {
		if (this.node.type.spec.reparseInView) return null;
		let t = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM) t.getContent = () => this.node.content;
		else if (!this.contentLost) t.contentElement = this.contentDOM;
		else {
			for (let e = this.children.length - 1; e >= 0; e--) {
				let n = this.children[e];
				if (this.dom.contains(n.dom.parentNode)) {
					t.contentElement = n.dom.parentNode;
					break;
				}
			}
			if (!t.contentElement) {
				let n = e && e.find((t) => t.nodeType == 1 && e.indexOf(t.parentNode) < 0 && this.dom.contains(t));
				n ? t.contentElement = n : t.getContent = () => w.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == G && e.eq(this.node) && Qa(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new eo(this, a && a.node, e);
		ro(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? tt.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Fa) && (a && this.protectLocalComposition(e, a), Ga(this.contentDOM, this.children, e), ea && io(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof C) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = ao(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		}
		return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc && (i.pmViewDesc = void 0);
		}
		let a = new Ra(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = oo(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == K || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = G;
	}
	updateOuterDeco(e) {
		if (Qa(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = Ya(this.dom, this.nodeDOM, Ja(this.outerDeco, this.node, t), Ja(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function Va(e, t, n, r, i) {
	Za(r, t, e);
	let a = new Ba(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var Ha = class e extends Ba {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == K || this.dirty != G && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != G || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = G, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = K);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, Ua = class extends Ia {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == G && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, Wa = class extends Ba {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == K) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		}
		return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
	stopEvent(e) {
		return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
};
function Ga(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = $a(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof za) {
			let t = r ? r.previousSibling : e.lastChild;
			Ga(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = $a(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var Ka = function(e) {
	e && (this.nodeName = e);
};
Ka.prototype = Object.create(null);
var qa = [new Ka()];
function Ja(e, t, n) {
	if (e.length == 0) return qa;
	let r = n ? qa[0] : new Ka(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new Ka(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new Ka(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function Ya(e, t, n, r) {
	if (n == qa && r == qa) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = qa[0], i = t);
		}
		Xa(i, o || qa[0], a);
	}
	return i;
}
function Xa(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function Za(e, t, n) {
	return Ya(e, e, qa, Ja(t, n, e.nodeType != 1));
}
function Qa(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function $a(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var eo = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = to(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = G, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i < 0 && this.index < this.top.children.length) {
				let t = this.top.children[this.index];
				t instanceof za && t.dirty != K && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = za.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == K && a.dom == a.contentDOM && (a.dirty = Fa), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof Ba) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != K && Qa(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Fa, u.updateChildren(r, a + 1), u.dirty = G), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Qa(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = Ba.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = Ba.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new La(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof za;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof Ha) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((B || z) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new Ua(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function to(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof za) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function no(e, t) {
	return e.type.side - t.type.side;
}
function ro(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d ||= [u]).push(e) : u = e);
		}
		if (u) {
			if (d) {
				d.sort(no);
				for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
			} else n(u, l, !!c);
		}
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function io(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function ao(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function oo(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function so(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Ui(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && S.isSelectable(e) && i.parent && !(e.isInline && Vi(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new S(o == e ? s : r.resolve(e));
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = vo(e, u, s, n);
	}
	return l;
}
function co(e) {
	return e.editable ? e.hasFocus() : bo(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function q(e, t = !1) {
	let n = e.state.selection;
	if (go(e, n), !co(e)) return;
	let r = e.input.mouseDown;
	if (!t && z && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Ii(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) ho(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		lo && !(n instanceof C) && (n.$from.parent.inlineContent || (a = uo(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = uo(e, n.to))), e.docView.setSelection(r, i, e, t), lo && (a && po(a), o && po(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && mo(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var lo = B || z && $i < 63;
function uo(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (B && i && i.contentEditable == "false") return fo(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return fo(i);
		if (a) return fo(a);
	}
}
function fo(e) {
	return e.contentEditable = "true", B && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function po(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function mo(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!co(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function ho(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, M(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && L && Zi <= 11 && (n.disabled = !0, n.disabled = !1);
}
function go(e, t) {
	if (t instanceof S) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (_o(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else _o(e);
}
function _o(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function vo(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || C.between(t, n, r);
}
function yo(e) {
	return e.editable && !e.hasFocus() ? !1 : bo(e);
}
function bo(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch {
		return !1;
	}
}
function xo(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Ii(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function So(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && ke.findFrom(a, t);
}
function Co(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function wo(e, t, n) {
	let r = e.state.selection;
	if (r instanceof C) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return Co(e, new C(r.$anchor, a));
		}
		if (!r.empty) return !1;
		if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = So(e.state, t);
			return n && n instanceof S ? Co(e, n) : !1;
		}
		if (!(V && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? S.isSelectable(i) ? Co(e, new S(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : na ? Co(e, new C(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof S && r.node.isInline) return Co(e, new C(t > 0 ? r.$to : r.$from));
	else {
		let n = So(e.state, t);
		return n ? Co(e, n) : !1;
	}
}
function To(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Eo(e, t) {
	let n = e.pmViewDesc;
	return n ? n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR") : e.nodeType == 1 && e.contentEditable == "false";
}
function Do(e, t) {
	return t < 0 ? Oo(e) : ko(e);
}
function Oo(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (R && n.nodeType == 1 && r < To(n) && Eo(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (Eo(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (Ao(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Eo(t, -1);) i = n.parentNode, a = M(t), t = t.previousSibling;
		if (t) n = t, r = To(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? No(e, n, r) : i && No(e, i, a);
}
function ko(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = To(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (Eo(e, 1)) a = n, o = ++r;
		else break;
	} else if (Ao(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Eo(t, 1);) a = t.parentNode, o = M(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = To(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && No(e, a, o);
}
function Ao(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function jo(e, t) {
	for (; e && t == e.childNodes.length && !Hi(e);) t = M(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function Mo(e, t) {
	for (; e && !t && !Hi(e);) t = M(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function No(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = jo(t, n)) ? (t = r, n = 0) : (e = Mo(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Ui(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && q(e);
	}, 50);
}
function Po(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(z || ta) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Fo(e, t, n) {
	let r = e.state.selection;
	if (r instanceof C && !r.empty || n.indexOf("s") > -1 || V && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = So(e.state, t);
		if (n && n instanceof S) return Co(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof Ee ? ke.near(n, t) : ke.findFrom(n, t);
		return o ? Co(e, o) : !1;
	}
	return !1;
}
function Io(e, t) {
	if (!(e.state.selection instanceof C)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function Lo(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function Ro(e) {
	if (!B || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		Lo(e, n, "true"), setTimeout(() => Lo(e, n, "false"), 20);
	}
	return !1;
}
function zo(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function Bo(e, t) {
	let n = t.keyCode, r = zo(t);
	if (n == 8 || V && n == 72 && r == "c") return Io(e, -1) || Do(e, -1);
	if (n == 46 && !t.shiftKey || V && n == 68 && r == "c") return Io(e, 1) || Do(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || V && n == 66 && r == "c") {
		let t = n == 37 ? Po(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return wo(e, t, r) || Do(e, t);
	}
	if (n == 39 || V && n == 70 && r == "c") {
		let t = n == 39 ? Po(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return wo(e, t, r) || Do(e, t);
	}
	return n == 38 || V && n == 80 && r == "c" ? Fo(e, -1, r) || Do(e, -1) : n == 40 || V && n == 78 && r == "c" ? Ro(e) || Fo(e, 1, r) || Do(e, 1) : !(r != (V ? "m" : "c") || n != 66 && n != 73 && n != 89 && n != 90);
}
function Vo(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || et.fromSchema(e.state.schema), s = Zo(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = Xo[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && l.nodeType == 1 && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function Ho(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new T(w.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = et.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = es(n), na && ts(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || $e.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !Uo.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = ns(Yo(s, +u[1], +u[2]), u[4]);
	else if (s = T.maxOpen(Wo(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = Yo(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var Uo = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Wo(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && Ko(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = qo(a[a.length - 1], i.length));
				let n = Go(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return w.from(a);
	}
	return e;
}
function Go(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, w.from(e));
	return e;
}
function Ko(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = Ko(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(w.from(Go(n, e, i + 1))));
	}
}
function qo(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, qo(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(w.empty, !0);
	return e.copy(n.append(r));
}
function Jo(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = Jo(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(w.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function Yo(e, t, n) {
	return t < e.openStart && (e = new T(Jo(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new T(Jo(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var Xo = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
};
function Zo() {
	return document.implementation.createHTMLDocument("title");
}
var Qo = null;
function $o(e) {
	let t = window.trustedTypes;
	if (!t) return e;
	if (!Qo) {
		if (Qo = t.defaultPolicy) try {
			return Qo.createHTML(e);
		} catch {}
		Qo = t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e });
	}
	return Qo.createHTML(e);
}
function es(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = Zo(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && Xo[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = $o(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
	for (let e = 0; e < n.styleSheets.length; e++) {
		let t = n.styleSheets[e];
		for (let e = 0; e < t.rules.length; e++) {
			let n = t.rules[e];
			if (n instanceof CSSStyleRule) {
				let e = r.querySelectorAll(n.selectorText);
				for (let t = 0; t < e.length; t++) e[t].style.cssText += n.style.cssText;
			}
		}
	}
	return r;
}
function ts(e) {
	let t = e.querySelectorAll(z ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function ns(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		try {
			t.checkAttrs(r[e + 1]);
		} catch {
			break;
		}
		i = w.from(t.create(r[e + 1], i)), a++, o++;
	}
	return new T(i, a, o);
}
var J = {}, Y = {}, rs = {
	touchstart: !0,
	touchmove: !0
}, is = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function as(e) {
	for (let t in J) {
		let n = J[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			ls(e, t) && !cs(e, t) && (e.editable || !(t.type in Y)) && n(e, t);
		}, rs[t] ? { passive: !0 } : void 0);
	}
	B && e.dom.addEventListener("input", () => null), ss(e);
}
function X(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function os(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function ss(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => cs(e, t));
	});
}
function cs(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function ls(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function us(e, t) {
	!cs(e, t) && J[t.type] && (e.editable || !(t.type in Y)) && J[t.type](e, t);
}
Y.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Ds(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(H && z && n.keyCode == 13))) {
		if (n.keyCode != 229 && e.domObserver.forceFlush(), ea && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
			let t = Date.now();
			e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
				e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, Wi(13, "Enter"))), e.input.lastIOSEnter = 0);
			}, 200);
		} else e.someProp("handleKeyDown", (t) => t(e, n)) || Bo(e, n) ? n.preventDefault() : X(e, "key");
	}
}, Y.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, Y.keypress = (e, t) => {
	let n = t;
	if (Ds(e) || !n.charCode || n.ctrlKey && !n.altKey || V && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof C) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function ds(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function fs(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function ps(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function ms(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function hs(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && S.isSelectable(r) ? (ms(e, new S(n), "pointer"), !0) : !1;
}
function gs(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof S && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (S.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i != null && (ms(e, S.create(e.state.doc, i), "pointer"), !0);
}
function _s(e, t, n, r, i) {
	return ps(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? gs(e, n) : hs(e, n));
}
function vs(e, t, n, r) {
	return ps(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function ys(e, t, n, r) {
	return ps(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || bs(e, n, r);
}
function bs(e, t, n) {
	if (n.button != 0) return !1;
	let r = xs(e, t, !0), i = e.state.doc;
	return r ? (ms(e, r, "pointer"), r instanceof C && i.eq(e.state.doc) && (e.input.mouseDown = new Es(e, r)), !0) : !1;
}
function xs(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? C.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return C.create(r, a + 1, a + 1 + t.content.size);
		if (n && S.isSelectable(t)) return S.create(r, a);
	}
	return null;
}
function Ss(e) {
	return Ns(e);
}
var Cs = V ? "metaKey" : "ctrlKey";
J.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Ss(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && fs(n, e.input.lastClick) && !n[Cs] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(ds(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Ts(e, o, n, !!r) : (a == "doubleClick" ? vs : ys)(e, o.pos, o.inside, n) ? n.preventDefault() : X(e, "pointer"));
};
var ws = class {
	constructor(e) {
		this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
	}
	up(e) {
		this.done();
	}
	move(e) {
		e.buttons == 0 && this.done();
	}
	done() {
		this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
	}
	delaySelUpdate() {
		return !1;
	}
}, Ts = class extends ws {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Cs], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof S && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !(!this.target || this.target.draggable),
			setUneditable: !!(this.target && R && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), X(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || q(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(ds(e))), this.updateAllowDefault(e), this.allowDefault || !t ? X(this.view, "pointer") : _s(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || B && this.mightDrag && !this.mightDrag.node.isAtom || z && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (ms(this.view, ke.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : X(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), X(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, Es = class extends ws {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), X(this.view, "pointer");
		let t = this.view.posAtCoords(ds(e)), n = t && xs(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		ms(this.view, C.create(r, a, o), "pointer");
	}
};
J.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Ss(e), X(e, "pointer");
}, J.touchmove = (e) => {
	e.input.lastTouch = Date.now(), X(e, "pointer");
}, J.contextmenu = (e) => Ss(e);
function Ds(e, t) {
	return e.composing ? !0 : B && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var Os = H ? 5e3 : -1;
Y.compositionstart = Y.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof C && t.selection.empty && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || z && ta && ks(e))) e.markCursor = e.state.storedMarks || n.marks(), Ns(e, !0), e.markCursor = null;
		else if (Ns(e, !t.selection.empty), R && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && n.nodeType == 1 && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (t.nodeType == 3) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				}
				n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	As(e, Os);
};
function ks(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
Y.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, As(e, 20));
};
function As(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => Ns(e), t));
}
function js(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function Ms(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = zi(t.focusNode, t.focusOffset), r = Bi(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (e && e.isText(n.nodeValue)) return r;
		}
	}
	return n || r;
}
function Ns(e, t = !1) {
	if (!(H && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), js(e), t || e.docView && e.docView.dirty) {
			let n = so(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function Ps(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var Fs = L && Zi < 15 || ea && ra < 604;
J.copy = Y.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = Fs ? null : n.clipboardData, { dom: o, text: s } = Vo(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : Ps(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Is(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function Ls(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Rs(e, r.value, null, i, t) : Rs(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function Rs(e, t, n, r, i) {
	let a = Ho(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || T.empty))) return !0;
	if (!a) return !1;
	let o = Is(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function zs(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
Y.paste = (e, t) => {
	let n = t;
	if (e.composing && !H) return;
	let r = Fs ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && Rs(e, zs(r), r.getData("text/html"), i, n) ? n.preventDefault() : Ls(e, n);
};
var Bs = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, Vs = V ? "altKey" : "ctrlKey";
function Hs(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[Vs] : !n;
}
J.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(ds(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof S ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = S.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = S.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = Vo(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !z || $i > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(Fs ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Fs || n.dataTransfer.setData("text/plain", c), e.dragging = new Bs(l, Hs(e, n), o);
}, J.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, Y.dragover = Y.dragenter = (e, t) => t.preventDefault(), Y.drop = (e, t) => {
	try {
		Us(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function Us(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(ds(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = Ho(e, zs(t.dataTransfer), Fs ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && Hs(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || T.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? ki(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && S.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new S(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(vo(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
J.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && q(e);
	}, 20));
}, J.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, J.beforeinput = (e, t) => {
	if (H && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, Wi(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in Y) J[e] = Y[e];
function Ws(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var Gs = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || Xs, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new Js(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && Ws(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, Ks = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Xs;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new Js(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Ws(this.attrs, t.attrs) && Ws(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, qs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Xs;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new Js(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Ws(this.attrs, t.attrs) && Ws(this.spec, t.spec);
	}
	destroy() {}
}, Js = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new Gs(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new Ks(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new qs(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof Ks;
	}
	get widget() {
		return this.type instanceof Gs;
	}
}, Ys = [], Xs = {}, Z = class e {
	constructor(e, t) {
		this.local = e.length ? e : Ys, this.children = t.length ? t : Ys;
	}
	static create(e, t) {
		return t.length ? rc(t, e, 0, Xs) : Q;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e ?? 0, t ?? 1e9, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == Q || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || Xs);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? Qs(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(ic), Ys) : Q;
	}
	add(t, n) {
		return n.length ? this == Q ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = tc(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, rc(s, e, o + 1, Xs)), a += 3;
			}
		});
		let o = $s(a ? nc(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(ic) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == Q ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == Q ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : Q;
	}
	forChild(t, n) {
		if (this == Q) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof Ks) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(ic), Ys);
			return r ? new Zs([t, r]) : t;
		}
		return r || Q;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return ac(this.localsInner(e));
	}
	localsInner(e) {
		if (this == Q) return Ys;
		if (e.inlineContent || !this.local.some(Ks.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof Ks || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
Z.empty = new Z([], []), Z.removeOverlap = ac;
var Q = Z.empty, Zs = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, Xs));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return Z.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != Q && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) {
				if (!t) t = i;
				else {
					n &&= (t = t.slice(), !1);
					for (let e = 0; e < i.length; e++) t.push(i[e]);
				}
			}
		}
		return t ? ac(n ? t : t.sort(ic)) : Ys;
	}
	static from(t) {
		switch (t.length) {
			case 0: return Q;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof Z) ? t : t.reduce((e, t) => e.concat(t instanceof Z ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function Qs(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == Q ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = rc(ec(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new Z(t.sort(ic), s);
}
function $s(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new Js(i.from + t, i.to + t, i.type));
	}
	return n;
}
function ec(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function tc(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function nc(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function rc(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = tc(e, t, o + n);
		if (s) {
			a = !0;
			let e = rc(s, t, n + o + 1, r);
			e != Q && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = $s(a ? nc(e) : e, -n).sort(ic);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new Z(o, i) : Q;
}
function ic(e, t) {
	return e.from - t.from || e.to - t.to;
}
function ac(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), oc(t, i + 1, a.copy(r.to, a.to)));
				continue;
			}
			a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), oc(t, i, r.copy(a.from, r.to)));
			break;
		}
	}
	return t;
}
function oc(e, t, n) {
	for (; t < e.length && ic(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function sc(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != Q && t.push(r);
	}), e.cursorWrapper && t.push(Z.create(e.state.doc, [e.cursorWrapper.deco])), Zs.from(t);
}
var cc = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, lc = L && Zi <= 11, uc = class {
	constructor() {
		this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
	}
	set(e) {
		this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
	}
	clear() {
		this.anchorNode = this.focusNode = null;
	}
	eq(e) {
		return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
	}
}, dc = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new uc(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			L && Zi <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : B && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), lc && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
		}), this.onSelectionChange = this.onSelectionChange.bind(this);
	}
	flushSoon() {
		this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
			this.flushingSoon = -1, this.flush();
		}, 20));
	}
	forceFlush() {
		this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
	}
	start() {
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, cc)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
				window.setTimeout(() => this.flush(), 20);
			}
			this.observer.disconnect();
		}
		this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
	}
	connectSelection() {
		this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
	}
	disconnectSelection() {
		this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
	}
	suppressSelectionUpdates() {
		this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
	}
	onSelectionChange() {
		if (yo(this.view)) {
			if (this.suppressingSelectionUpdates) return q(this.view);
			if (L && Zi <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Ii(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = Ni(n)) t.add(n);
		for (let r = e.anchorNode; r; r = Ni(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: n.nodeType == 3 ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && yo(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || z && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && t.nodeType == 1;) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (R && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || _c(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ui(n) && (c = so(e)) && c.eq(ke.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, q(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), mc(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, vc(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || q(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), r.nodeType == 3 && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (L && Zi <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? M(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? M(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		}
		return e.type == "attributes" ? {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		} : (this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		});
	}
}, fc = /* @__PURE__ */ new WeakMap(), pc = !1;
function mc(e) {
	if (!fc.has(e) && (fc.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = R, pc) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), pc = !0;
	}
}
function hc(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Ii(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function gc(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return hc(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? hc(e, n) : null;
}
function _c(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function vc(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || e.nodeType != 1 || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function yc(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && e.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Ui(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), z && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || $e.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: bc(r),
		context: m
	});
	if (u && u[0].pos != null) {
		let e = u[0].pos, t = u[1] && u[1].pos;
		t ??= e, h = {
			anchor: e + s,
			head: t + s
		};
	}
	return {
		doc: g,
		sel: h,
		from: s,
		to: c
	};
}
var bc = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (B && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		}
		if (t.parentNode.lastChild == t || B && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, xc = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Sc(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = so(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (z && H && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, Wi(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = yc(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Dc(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (ea && e.input.lastIOSEnter > Date.now() - 225 || H) && i.some((e) => e.nodeType == 1 && !xc.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, Wi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) {
		if (r && c instanceof C && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
			start: c.from,
			endA: c.to,
			endB: c.to
		};
		else {
			if (l.sel) {
				let t = Cc(e, e.state.doc, l.sel);
				if (t && !t.eq(e.state.selection)) {
					let n = e.state.tr.setSelection(t);
					a && n.setMeta("composition", a), e.dispatch(n);
				}
			}
			return;
		}
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof C && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), L && Zi <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), ee = u.resolve(m.start), te = h.sameParent(g) && h.parent.inlineContent && ee.end() >= m.endA;
	if ((ea && e.input.lastIOSEnter > Date.now() - 225 && (!te || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !te && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, Wi(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && Tc(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, Wi(8, "Backspace")))) {
		H && z && e.domObserver.suppressSelectionUpdates();
		return;
	}
	z && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), H && !te && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, Wi(13, "Enter"));
		});
	}, 20));
	let _ = m.start, v = m.endA, ne = (t) => {
		let n = t || e.state.tr.replace(_, v, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = Cc(e, n.doc, l.sel);
			t && !(z && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == _ || t.head == n.mapping.map(v) - 1) || L && t.empty && t.head == _) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, re;
	if (te) {
		if (h.pos == g.pos) {
			L && Zi <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => q(e), 20));
			let t = ne(e.state.tr.delete(_, v)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
			n && t.ensureMarks(n), e.dispatch(t);
		} else if (m.endA == m.endB && (re = wc(h.parent.content.cut(h.parentOffset, g.parentOffset), ee.parent.content.cut(ee.parentOffset, m.endA - ee.start())))) {
			let t = ne(e.state.tr);
			re.type == "add" ? t.addMark(_, v, re.mark) : t.removeMark(_, v, re.mark), e.dispatch(t);
		} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
			let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => ne(e.state.tr.insertText(t, _, v));
			e.someProp("handleTextInput", (r) => r(e, _, v, t, n)) || e.dispatch(n());
		} else e.dispatch(ne());
	} else e.dispatch(ne());
}
function Cc(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : vo(e, t.resolve(n.anchor), t.resolve(n.head));
}
function wc(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (w.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function Tc(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || Ec(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(Ec(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || Ec(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Ec(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Dc(e, t, n, r, i) {
	let a = e.findDiffStart(t, n), o = n + e.size, s = n + t.size;
	if (a == null) return null;
	let { a: c, b: l } = e.findDiffEnd(t, o, s);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(c, l));
		r -= c + e - a;
	}
	if (c < a && o < s) {
		let e = r <= a && r >= c ? a - r : 0;
		a -= e, l = a + (l - c), c = a;
	} else if (l < a) {
		let e = r <= a && r >= l ? a - r : 0;
		a -= e, c = a + (c - l), l = a;
	}
	return {
		start: a,
		endA: c,
		endB: l
	};
}
var Oc = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new is(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Fc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = jc(this), Ac(this), this.nodeViews = Nc(this), this.docView = Va(this.state.doc, kc(this), sc(this), this.dom, this), this.domObserver = new dc(this, (e, t, n, r) => Sc(this, e, t, n, r)), this.domObserver.start(), as(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && ss(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(Fc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		let n = this.state, r = !1, i = !1;
		e.storedMarks && this.composing && (js(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = Nc(this);
			Pc(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && ss(this), this.editable = jc(this), Ac(this);
		let o = sc(this), s = kc(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && sa(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (L || z) && !this.composing && !n.selection.empty && !e.selection.empty && Mc(n.selection, e.selection);
			if (l) {
				let n = z ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = Ms(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = Va(e.doc, s, o, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && xo(this) && i.delaySelUpdate()) ? q(this, t) : (go(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && la(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (e && this.dom.contains(e.nodeType == 1 ? e : e.parentNode) && !this.someProp("handleScrollToSelection", (e) => e(this))) {
			if (this.state.selection instanceof S) {
				let t = this.docView.domAfterPos(this.state.selection.from);
				t.nodeType == 1 && oa(this, t.getBoundingClientRect(), e);
			} else oa(this, this.coordsAtPos(this.state.selection.head, 1), e);
		}
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new Bs(e.slice, e.move, r < 0 ? void 0 : S.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (L) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && fa(this.dom), q(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return ba(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Ca(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return Na(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return Rs(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return Rs(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return Vo(this, e);
	}
	destroy() {
		this.docView && (os(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], sc(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Fi());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return us(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? B && this.root.nodeType === 11 && Gi(this.dom.ownerDocument) == this.dom && gc(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
Oc.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function kc(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [Js.node(0, e.state.doc.content.size, t)];
}
function Ac(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: Js.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function jc(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function Mc(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function Nc(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function Pc(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function Fc(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
//#endregion
//#region src/schema/change-widgets.ts
var Ic = new Oe("planChangeWidgets");
function Lc(e, t) {
	return Ce({
		key: "planChangeWidgets",
		prosemirrorPlugins: [new De({
			key: Ic,
			props: { decorations: (n) => Z.create(n.doc, Rc(n, e, t)) }
		})]
	});
}
function Rc(e, t, n) {
	let r = Hc(e);
	return Le(t).flatMap((e) => {
		let t = zc(r, e);
		return t === void 0 ? [] : [Bc(t, e, n)];
	});
}
function zc(e, t) {
	return t.anchorId ? e.ends.get(t.anchorId) : e.starts.get(`actions-${t.slot}`);
}
function Bc(e, t, n) {
	return Js.widget(e, () => Vc(t.changeId, n), {
		side: 1,
		key: t.changeId
	});
}
function Vc(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = document.createElement("div");
	return r.dataset.changeId = e, t.set(e, r), r;
}
function Hc(e) {
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
function Uc({ session: e, meta: t, user: n, onChange: r }) {
	let i = l(() => /* @__PURE__ */ new Map(), []), o = Wc(e, n, i), s = Gc(o, e, a((e) => r?.(Lt(e, t)), [t, r]));
	return {
		editor: o,
		plan: l(() => Lt(s, t), [s, t]),
		hosts: i
	};
}
function Wc(e, t, n) {
	let { doc: r } = e;
	return ye(Qe({
		schema: gr,
		extensions: [_t, Lc(r, n)],
		collaboration: {
			fragment: r.getXmlFragment(h),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function Gc(e, t, n) {
	let [r, i] = d(() => Ue(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var Kc = {};
function qc({ transport: e, adapters: t = Kc, className: n, ...r }) {
	let i = si(e);
	return /* @__PURE__ */ y(rt, {
		value: t,
		children: /* @__PURE__ */ y("div", {
			className: Jc({
				...r,
				className: n
			}),
			children: i ? /* @__PURE__ */ y(Yc, {
				...r,
				session: i
			}) : /* @__PURE__ */ y(Xr, { status: "connecting" })
		})
	});
}
function Jc({ showOutline: e, className: t }) {
	let n = e === !1 ? Rr.single : Rr.withOutline;
	return [
		Rr.editor,
		n,
		"ps-editor",
		t
	].filter(Boolean).join(" ");
}
function Yc({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = ci(t.session);
	if (!r) return /* @__PURE__ */ y(Xr, {
		status: n,
		reason: i
	});
	let a = e ?? se(r.type);
	return /* @__PURE__ */ b(In, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ y(Xr, {
			status: n,
			reason: i
		}), /* @__PURE__ */ y(Xc, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function Xc({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s, hosts: c } = Uc(r), l = Zc(i, o, c), u = nl(s, e, t);
	return Gr(o, i.awareness), /* @__PURE__ */ y(it, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ y(Qc, {
			...r,
			...l,
			...s,
			report: u
		})
	});
}
function Zc(e, t, n) {
	return {
		editor: t,
		hosts: n,
		doc: e.doc,
		awareness: e.awareness
	};
}
function Qc({ showOutline: e = !0, showPresence: t = !0, ...n }) {
	let r = $c(n.sections);
	return /* @__PURE__ */ b(Ln, {
		value: r,
		children: [
			t && /* @__PURE__ */ y(qr, {
				...n,
				titles: r
			}),
			/* @__PURE__ */ y(tl, { ...n }),
			e && /* @__PURE__ */ y(el, { ...n })
		]
	});
}
function $c(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function el({ template: e, report: t, sections: n, outlineFooter: r }) {
	return /* @__PURE__ */ y(Fr, {
		template: e,
		report: t,
		sections: n,
		children: r
	});
}
function tl({ editor: e, readOnly: t, doc: n, hosts: r }) {
	let i = Zr(n, () => rl(e));
	return /* @__PURE__ */ b(p, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [
			/* @__PURE__ */ y(Dr, {}),
			/* @__PURE__ */ y(Ot, {}),
			/* @__PURE__ */ y(st, {
				changes: i,
				hosts: r
			})
		]
	});
}
function nl(e, t, n) {
	let r = l(() => ue(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
function rl(e) {
	queueMicrotask(() => {
		let t = e.prosemirrorView;
		t.isDestroyed || t.dispatch(t.state.tr);
	});
}
//#endregion
//#region src/session/memory-hub.ts
function il(e) {
	let t = Be(e.blocks), n = new Ke(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return ol(r), {
		doc: t,
		connect: () => cl(r)
	};
}
function al(e) {
	return il(e).connect();
}
function ol(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => sl(t, n, {
		type: "update",
		update: Ge(e)
	})), r.on("update", (n, i) => {
		let a = Je(r, e(n));
		sl(t, i, {
			type: "awareness",
			update: Ge(a)
		});
	});
}
function sl(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function cl(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => ll(e, t, n),
		subscribe: (n) => (t.handlers.add(n), ul(e, n), () => t.handlers.delete(n))
	};
}
function ll(e, t, n) {
	if (n.type === "update") {
		Xe(e.doc, Ve(n.update), t);
		return;
	}
	qe(e.awareness, Ve(n.update), t);
}
function ul({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: Ge(Ze(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = Je(t, i);
		r({
			type: "awareness",
			update: Ge(e)
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
}, dl = {
	kept: " ",
	added: "+",
	removed: "-"
};
function fl({ before: e, after: t, className: n }) {
	let r = ee(e, t), i = r.sections.length === 0 && r.meta.length === 0;
	return /* @__PURE__ */ b("section", {
		className: [
			$.diff,
			"ps-diff",
			n
		].filter(Boolean).join(" "),
		"aria-label": `Changes from version ${e.version} to ${t.version}`,
		children: [
			i && /* @__PURE__ */ y("p", {
				className: $.same,
				children: "Nothing changed"
			}),
			/* @__PURE__ */ y(pl, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ y(ml, { section: e }, e.slot)),
			/* @__PURE__ */ y(hl, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function pl({ changes: e }) {
	return /* @__PURE__ */ y("ul", {
		className: $.meta,
		children: e.map((e) => /* @__PURE__ */ b("li", { children: [
			e.field,
			": ",
			e.before,
			" to ",
			e.after
		] }, e.field))
	});
}
function ml({ section: e }) {
	return /* @__PURE__ */ b("article", {
		"aria-label": e.title,
		children: [/* @__PURE__ */ y("h3", {
			className: $.title,
			children: e.title
		}), /* @__PURE__ */ y("ol", {
			className: $.lines,
			children: e.lines.map((e, t) => /* @__PURE__ */ b("li", {
				className: $[e.kind],
				children: [/* @__PURE__ */ b("span", {
					"aria-hidden": "true",
					children: [dl[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function hl({ what: e, changes: t }) {
	return t.length === 0 ? null : /* @__PURE__ */ b("article", {
		"aria-label": e,
		children: [/* @__PURE__ */ y("h3", {
			className: $.title,
			children: e
		}), /* @__PURE__ */ y("ul", {
			className: $.lines,
			children: t.map((e) => /* @__PURE__ */ b("li", {
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
export { fl as PlanDiffView, qc as PlanEditor, vt as bypassTemplate, il as createMemoryHub, It as fromEditorBlocks, al as localTransport, gr as planSchema, Lt as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map