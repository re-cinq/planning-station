import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useState as u, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as d, PLAN_FRAGMENT as ne, diffPlans as re, findSectionSlot as f, isRequiredAt as ie, newId as p, optionsOf as ae, parseBlock as oe, previewProposal as se, refineInputs as ce, settledCount as le, templateFor as ue, toPlanDocument as de, usesOf as fe, validatePlan as pe } from "@re-cinq/planning-document";
import { offset as me } from "@floating-ui/react";
import { SideMenuExtension as he } from "@blocknote/core/extensions";
import { SideMenu as ge, SideMenuController as _e, SuggestionMenuController as ve, createReactBlockSpec as m, useBlockNoteEditor as h, useCreateBlockNote as ye, useEditorChange as g, useExtensionState as be } from "@blocknote/react";
import { BlockNoteSchema as xe, createExtension as Se, filterSuggestionItems as Ce, insertOrUpdateBlockForSlashMenu as we } from "@blocknote/core";
import { Plugin as Te } from "prosemirror-state";
import { ySyncPluginKey as Ee } from "y-prosemirror";
import { Fragment as De, jsx as _, jsxs as v } from "react/jsx-runtime";
import { PROSE_BLOCK_SPECS as Oe, acceptRefine as ke, applyRefineAnyway as Ae, askRefine as je, discardRefine as Me, docFromBlocks as Ne, fromBase64 as y, proposalsIn as Pe, readBlocks as b, toBase64 as x } from "@re-cinq/planning-yjs";
import { Awareness as Fe, applyAwarenessUpdate as Ie, encodeAwarenessUpdate as S } from "y-protocols/awareness";
import { Doc as Le, applyUpdate as C, encodeStateAsUpdate as Re } from "yjs";
import { withCollaboration as ze } from "@blocknote/core/yjs";
//#region src/blocks/adapters.ts
var Be = n({}), Ve = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function w() {
	return i(Ve);
}
//#endregion
//#region src/template/template-guard.ts
var He = "planTemplateBypass", Ue = "section-heading", We = "blockContent", Ge = [
	"plan-title",
	Ue,
	"section-panel",
	"section-actions"
], Ke = Se({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Te({ filterTransaction: Je })]
});
function qe(e, t) {
	return e.setMeta(He, t);
}
function Je(e, t) {
	if (!e.docChanged || Ye(e)) return !0;
	let n = T(t.doc), r = T(e.doc);
	return et(Ze(n), Ze(r)) && Qe(n, r);
}
function Ye(e) {
	let t = e.getMeta(Ee);
	return !!e.getMeta(He) || t?.isChangeOrigin === !0;
}
function T(e) {
	let t = [];
	return e.descendants((e) => {
		Xe(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Xe(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(We);
}
function Ze(e) {
	return e.filter((e) => Ge.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function Qe(e, t) {
	return $e(t) === 0 || $e(e) > 0;
}
function $e(e) {
	let t = e.findIndex((e) => e.type === Ue);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function et(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var tt = { useFloatingOptions: {
	placement: "left-start",
	middleware: [me(({ elements: e, rects: t }) => {
		let n = it(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function nt() {
	return /* @__PURE__ */ _(_e, {
		floatingUIOptions: tt,
		sideMenu: rt
	});
}
function rt() {
	let e = be(he, { selector: (e) => e?.block.type });
	return e === void 0 || Ge.includes(e) ? null : /* @__PURE__ */ _(ge, {});
}
function it(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? at(t) : null;
}
function at(e) {
	let t = ot(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function ot(e) {
	let t = st(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && ct(n);
}
function st(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function ct(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function lt(e) {
	return e;
}
function E(e) {
	return e.map(oe);
}
function D(e, t) {
	return de(E(e), t);
}
var O = {
	comment: "_comment_xr1pj_1",
	text: "_text_xr1pj_23",
	who: "_who_xr1pj_27",
	author: "_author_xr1pj_36",
	when: "_when_xr1pj_40",
	badge: "_badge_xr1pj_44",
	actions: "_actions_xr1pj_54",
	reply: "_reply_xr1pj_78",
	input: "_input_xr1pj_82"
}, ut = { props: { resolved: !0 } }, dt = { props: { resolved: !1 } };
function ft({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = bt(A(e));
	return /* @__PURE__ */ v("aside", {
		className: O.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${j(e)}`,
		...pt({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ _(mt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ _("div", {
				className: O.text,
				ref: n
			}),
			!r && t.isEditable && /* @__PURE__ */ _(ht, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function pt({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function mt({ block: e, resolved: t }) {
	return /* @__PURE__ */ v("p", {
		className: O.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: O.author,
				children: j(e)
			}),
			/* @__PURE__ */ _("time", {
				className: O.when,
				children: Tt(e.props.at)
			}),
			t && /* @__PURE__ */ _("span", {
				className: O.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function ht({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: O.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ _(k, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, dt)
		}) : /* @__PURE__ */ _(gt, {
			block: e,
			editor: t
		})
	});
}
function gt({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ v(De, { children: [n ? /* @__PURE__ */ _(_t, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ _(k, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ _(k, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, ut)
	})] });
}
function k({ label: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function _t({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = yt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ _("form", {
		className: O.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ _(vt, {
			to: j(e),
			draft: r,
			onDraft: i
		})
	});
}
function vt({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ _("input", {
		className: O.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function yt({ editor: e, block: t }) {
	let { user: n } = w(), r = h();
	return (i) => {
		if (!i) return;
		let a = A(t), o = r.document, s = St(o, a) ?? t;
		e.insertBlocks([wt(a, i, n.name)], s, "after");
	};
}
function bt(e) {
	let t = h(), n = () => xt(t.document, e), [r, i] = u(n);
	return g(() => i(n())), r;
}
function xt(e, t) {
	return e.some((e) => Ct(e) && A(e) === t && e.props.resolved === !0);
}
function St(e, t) {
	return e.filter((e) => e.type === "comment" && A(e) === t).at(-1);
}
function Ct(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function A(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function j(e) {
	return String(e.props.author || "Someone");
}
function wt(e, t, n) {
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
function Tt(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
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
function Et({ block: e }) {
	let { renderMockup: t } = o(Be);
	return /* @__PURE__ */ v("figure", {
		className: M.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ v("figcaption", {
			className: M.label,
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
var Dt = {
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
}, Ot = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function kt({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: N.steps,
		disabled: r
	};
	return /* @__PURE__ */ v("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ _("legend", {
			className: N.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ _(At, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function At({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ v("label", {
		className: N.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ _("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), Ot[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var jt = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function Mt(e, t) {
	return e[String(t)] ?? String(t);
}
var P = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function Nt({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ v("span", {
		className: P.field,
		"data-field": e,
		children: [/* @__PURE__ */ _("label", {
			className: P.label,
			htmlFor: n,
			children: Mt(jt, e)
		}), /* @__PURE__ */ _(Pt, {
			...t,
			id: n
		})]
	});
}
function Pt(e) {
	return e.spec.values ? /* @__PURE__ */ _(Ft, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ _(It, { ...e });
}
function Ft({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ _("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ _("option", { children: e }, e))
	});
}
function It({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ _("input", {
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
var Lt = { maturity: kt };
function Rt({ block: e, editor: t, contentRef: n }) {
	let r = Dt[e.type];
	return /* @__PURE__ */ v("div", {
		className: M.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ _(zt, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ _("div", {
			className: M.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function zt({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ v("div", {
		className: M.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("p", {
			className: M.head,
			children: [/* @__PURE__ */ _("span", {
				className: M.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ _(Bt, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ _(Vt, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Bt({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ v("a", {
		className: M.link,
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
function Vt({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(Lt[n] ?? Nt, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Ht = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Ut({ contentRef: e }) {
	return /* @__PURE__ */ _("h1", {
		className: Ht.title,
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
function Wt({ block: e, editor: t, contentRef: n }) {
	let r = ae(e.props.options);
	return /* @__PURE__ */ v("div", {
		className: F.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ _(Gt, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ _("div", {
				className: F.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ _(Kt, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Gt({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ _("p", {
		className: F.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ _("span", {
			className: F.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ v("p", {
		className: F.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: F.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ _("span", {
				className: F.why,
				children: e
			}),
			/* @__PURE__ */ _("span", {
				className: F.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Kt({ block: e, editor: t, options: n }) {
	return Qt(en(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ _(qt, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ _(Yt, {
		block: e,
		editor: t
	});
}
function qt({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ _("ul", {
		className: F.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Jt, {
			onPick: () => Zt(t, e, n),
			children: n
		}) }, n))
	});
}
function Jt({ onPick: e, children: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: F.suggestion,
		onClick: e,
		children: t
	});
}
function Yt({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ v("form", {
		className: F.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Zt(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ _(Xt, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: F.answerButton,
			children: "Answer"
		})]
	});
}
function Xt({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ _("input", {
		className: F.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Zt(e, t, n) {
	if (!n) return;
	let r = en(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Qt(e) {
	let t = h(), [n, r] = u(() => $t(t.document, e));
	return g(() => r($t(t.document, e))), n;
}
function $t(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function en(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var I = n(null), tn = n(/* @__PURE__ */ new Map());
function L(e) {
	let t = o(I), n = o(tn).get(e);
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var R = /* @__PURE__ */ new WeakMap();
function nn(e, t) {
	let n = an(e);
	return l(() => {
		let n = on(e), r = ce(n, t), i = Pe(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: le(r),
			proposal: i,
			preview: i?.status === "proposed" ? se(n, i) : void 0,
			...rn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function rn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: fe(n),
			baseHash: je(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void ke(e, t),
		applyAnyway: () => void Ae(e, t),
		discard: () => Me(e, t)
	};
}
function an(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function on(e) {
	let t = R.get(e);
	if (t) return t;
	let n = b(e);
	return R.set(e, n), e.once("update", () => R.delete(e)), n;
}
var z = {
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
//#region src/blocks/RefineControls.tsx
function sn(e) {
	let t = nn(e.doc, e.slot), n = cn(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ _(dn, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ _(un, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ _(ln, { ...r });
}
function cn({ slot: e, title: t }, n) {
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
function ln({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ v("p", {
		className: z.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: z.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ _("span", {
			className: z.note,
			children: n ? `uses ${hn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function un({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ v("p", {
		className: z.bar,
		role: "status",
		children: [/* @__PURE__ */ v("span", {
			className: z.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: z.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function dn({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ v("section", {
		className: z.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ v("p", {
				className: z.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					gn(r)
				]
			}),
			/* @__PURE__ */ _(pn, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ v("p", {
				className: z.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ _(fn, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function fn({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ v("p", {
		className: z.bar,
		children: [
			/* @__PURE__ */ _("button", {
				type: "button",
				className: z.refine,
				onClick: i,
				children: r
			}),
			n && /* @__PURE__ */ _(B, {
				label: "Apply anyway",
				run: e.applyAnyway
			}),
			/* @__PURE__ */ _(B, {
				label: "Discard",
				run: e.discard
			})
		]
	});
}
function B({ label: e, run: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: z.quiet,
		onClick: t,
		children: e
	});
}
function pn({ lines: e }) {
	return /* @__PURE__ */ _("ul", {
		className: z.lines,
		children: e.map((e, t) => /* @__PURE__ */ _("li", {
			className: z[e.kind],
			children: /* @__PURE__ */ _(mn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function mn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ _("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ _("del", { children: e.text }) : e.text;
}
function hn({ inputs: e }) {
	return _n(e.answered.length, e.resolved.length);
}
function gn({ uses: e }) {
	let t = _n(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function _n(e, t) {
	return [vn(e, "answer"), vn(t, "resolved thread")].filter(Boolean).join(", ");
}
function vn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var yn = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function bn({ block: e, editor: t }) {
	let { slot: n, title: r } = xn(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ _("div", {
		role: "group",
		className: yn.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ _(sn, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function xn(e) {
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
function Sn({ block: e }) {
	let t = L(e.props.slot);
	return /* @__PURE__ */ v("header", {
		className: V.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("h2", {
			className: V.title,
			children: e.props.title
		}), t && /* @__PURE__ */ _("p", {
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
function Cn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = L(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ _("aside", {
		className: H.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ _(wn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function wn({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = u("");
	return /* @__PURE__ */ v("form", {
		className: H.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(En({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ _("input", {
			className: H.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ _(Tn, {})]
	});
}
function Tn() {
	return /* @__PURE__ */ _("button", {
		type: "submit",
		className: H.send,
		children: "Comment"
	});
}
function En({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([Dn(n, r)], e, "before"), "");
}
function Dn(e, t) {
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
var U = { render: Rt }, On = {
	"plan-title": m(d["plan-title"], { render: Ut })(),
	"section-heading": m(d["section-heading"], { render: Sn })(),
	"section-panel": m(d["section-panel"], { render: Cn })(),
	"section-actions": m(d["section-actions"], { render: bn })(),
	comment: m(d.comment, { render: ft })(),
	kpi: m(d.kpi, U)(),
	prototype: m(d.prototype, U)(),
	mockup: m(d.mockup, { render: Et })(),
	question: m(d.question, { render: Wt })(),
	answer: m(d.answer, U)()
}, W = xe.create({ blockSpecs: {
	...Oe,
	...On
} });
//#endregion
//#region src/menu/section-context.ts
function kn(e, t) {
	let [n] = jn(e, t);
	return n ? String(n.props.slot) : null;
}
function An(e, t) {
	let n = jn(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function jn(e, t) {
	let n = e.slice(0, Mn(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function Mn(e, t) {
	return e.findIndex((e) => Nn(e, t));
}
function Nn(e, t) {
	return e.id === t || e.children.some((e) => Nn(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", q = { cells: [
	"",
	"",
	""
] }, Pn = [
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
			rows: [q, q]
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
			let t = An(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Fn(e, t) {
	return Pn.filter((t) => e.allows.includes(t.kind)).flatMap((e) => In(e, t));
}
function In(e, t) {
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
function Ln() {
	let e = h(W), t = o(I);
	return /* @__PURE__ */ _(ve, {
		triggerCharacter: "/",
		getItems: async (n) => Ce(Rn(e, t), n)
	});
}
function Rn(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && zn(t, i);
	return a ? Fn(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => we(e, lt(t))
	})) : [];
}
function zn(e, { blocks: t, cursorId: n }) {
	let r = kn(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Bn(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => Vn(e, t, n));
}
function Vn(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ie(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Hn(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var J = {
	outline: "_outline_juazx_1",
	phase: "_phase_juazx_8",
	slots: "_slots_juazx_15",
	title: "_title_juazx_22",
	required: "_required_juazx_26",
	problems: "_problems_juazx_30",
	footer: "_footer_juazx_36"
}, Un = [];
function Wn({ template: e, report: t, sections: n = Un, children: r }) {
	return /* @__PURE__ */ v("nav", {
		className: J.outline,
		"aria-label": "Plan outline",
		children: [
			/* @__PURE__ */ v("p", {
				className: J.phase,
				children: [
					t.passed ? "Ready for" : "Not ready for",
					" ",
					t.phase
				]
			}),
			/* @__PURE__ */ _(Gn, {
				template: e,
				report: t,
				sections: n
			}),
			r && /* @__PURE__ */ _("div", {
				className: J.footer,
				children: r
			})
		]
	});
}
function Gn({ template: e, report: t, sections: n }) {
	let r = Hn(t.problems);
	return /* @__PURE__ */ _("ol", {
		className: J.slots,
		children: Bn(e, n, t.phase).map((e) => /* @__PURE__ */ _(Kn, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Kn({ section: e, problems: t }) {
	return /* @__PURE__ */ v("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ _("span", {
				className: J.title,
				children: e.title
			}),
			e.required && /* @__PURE__ */ _("span", {
				className: J.required,
				children: " required"
			}),
			/* @__PURE__ */ _("ul", {
				className: J.problems,
				children: t.map((e) => /* @__PURE__ */ _("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var Y = {
	editor: "_editor_o6zst_1",
	withOutline: "_withOutline_o6zst_9",
	single: "_single_o6zst_13"
}, X = {
	bar: "_bar_xsz4f_1",
	user: "_user_xsz4f_14",
	dot: "_dot_xsz4f_20"
};
//#endregion
//#region src/presence/presence-users.ts
function qn(e, t) {
	return [...e].flatMap(([e, { user: n, editing: r }]) => e === t || !n ? [] : [Jn(e, n, r)]);
}
function Jn(e, t, n) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: Yn(n)
	};
}
function Yn(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Xn(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function Zn(e) {
	let [t, n] = u(() => $n(e));
	return s(() => {
		let t = () => n($n(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function Qn(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: kn(r, n.id) });
	}), [e, t]);
}
function $n(e) {
	return qn(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/PresenceBar.tsx
function er({ awareness: e, template: t, titles: n }) {
	let r = Zn(e);
	return /* @__PURE__ */ _("ul", {
		className: X.bar,
		"aria-label": "Also editing",
		children: r.map((e) => /* @__PURE__ */ v("li", {
			className: X.user,
			children: [/* @__PURE__ */ _("svg", {
				className: X.dot,
				viewBox: "0 0 2 2",
				"aria-hidden": "true",
				children: /* @__PURE__ */ _("circle", {
					cx: "1",
					cy: "1",
					r: "1",
					fill: e.color
				})
			}), Xn(e, t, n)]
		}, e.clientId))
	});
}
var tr = { notice: "_notice_1xdcv_1" }, nr = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ v("p", {
		className: tr.notice,
		role: "status",
		"data-status": e,
		children: [nr[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/plan-session.ts
var Q = "plan-transport";
function rr(e) {
	let t = new Le(), n = {
		doc: t,
		awareness: new Fe(t)
	}, r = ar({
		status: "connecting",
		meta: null
	});
	cr(n, e);
	let i = e.subscribe((e) => sr({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => ir(n, i)
	};
}
function ir({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function ar(e) {
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
var or = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		C(e, y(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => C(e, y(t), Q),
	awareness: ({ awareness: e }, { update: t }) => Ie(e, y(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function sr(e, t) {
	or[t.type](e, t);
}
function cr({ doc: t, awareness: n }, r) {
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
function lr(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = rr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function ur(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/use-plan-editor.ts
function dr({ session: e, meta: t, user: n, onChange: r }) {
	let i = fr(e, n), o = pr(i, e, a((e) => r?.(D(e, t)), [t, r]));
	return {
		editor: i,
		plan: l(() => D(o, t), [o, t])
	};
}
function fr(e, t) {
	let { doc: n } = e;
	return ye(ze({
		schema: W,
		extensions: [Ke],
		collaboration: {
			fragment: n.getXmlFragment(ne),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function pr(e, t, n) {
	let [r, i] = u(() => b(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var mr = {};
function hr({ transport: e, adapters: t = mr, className: n, ...r }) {
	let i = lr(e);
	return /* @__PURE__ */ _(Be, {
		value: t,
		children: /* @__PURE__ */ _("div", {
			className: gr({
				...r,
				className: n
			}),
			children: i ? /* @__PURE__ */ _(_r, {
				...r,
				session: i
			}) : /* @__PURE__ */ _(Z, { status: "connecting" })
		})
	});
}
function gr({ showOutline: e, className: t }) {
	let n = e === !1 ? Y.single : Y.withOutline;
	return [
		Y.editor,
		n,
		"ps-editor",
		t
	].filter(Boolean).join(" ");
}
function _r({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = ur(t.session);
	if (!r) return /* @__PURE__ */ _(Z, {
		status: n,
		reason: i
	});
	let a = e ?? ue(r.type);
	return /* @__PURE__ */ v(I, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ _(Z, {
			status: n,
			reason: i
		}), /* @__PURE__ */ _(vr, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function vr({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s } = dr(r), c = Cr(s, e, t), { awareness: l } = i;
	Qn(o, l);
	let u = {
		...r,
		editor: o,
		awareness: l,
		report: c,
		sections: s.sections
	};
	return /* @__PURE__ */ _(Ve, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ _(yr, { ...u })
	});
}
function yr({ showOutline: e = !0, showPresence: t = !0, ...n }) {
	let r = br(n.sections);
	return /* @__PURE__ */ v(tn, {
		value: r,
		children: [
			t && /* @__PURE__ */ _(er, {
				...n,
				titles: r
			}),
			/* @__PURE__ */ _(Sr, { ...n }),
			e && /* @__PURE__ */ _(xr, { ...n })
		]
	});
}
function br(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function xr({ template: e, report: t, sections: n, outlineFooter: r }) {
	return /* @__PURE__ */ _(Wn, {
		template: e,
		report: t,
		sections: n,
		children: r
	});
}
function Sr({ editor: e, readOnly: t }) {
	return /* @__PURE__ */ v(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [/* @__PURE__ */ _(Ln, {}), /* @__PURE__ */ _(nt, {})]
	});
}
function Cr(e, t, n) {
	let r = l(() => pe(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
//#endregion
//#region src/session/memory-hub.ts
function wr(e) {
	let t = Ne(e.blocks), n = new Fe(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return Er(r), {
		doc: t,
		connect: () => Or(r)
	};
}
function Tr(e) {
	return wr(e).connect();
}
function Er(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Dr(t, n, {
		type: "update",
		update: x(e)
	})), r.on("update", (n, i) => {
		let a = S(r, e(n));
		Dr(t, i, {
			type: "awareness",
			update: x(a)
		});
	});
}
function Dr(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Or(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => kr(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Ar(e, n), () => t.handlers.delete(n))
	};
}
function kr(e, t, n) {
	if (n.type === "update") {
		C(e.doc, y(n.update), t);
		return;
	}
	Ie(e.awareness, y(n.update), t);
}
function Ar({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: x(Re(e))
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
}, jr = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Mr({ before: e, after: t, className: n }) {
	let r = re(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ _(Nr, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ _(Pr, { section: e }, e.slot)),
			/* @__PURE__ */ _(Fr, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function Nr({ changes: e }) {
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
function Pr({ section: e }) {
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
					children: [jr[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Fr({ what: e, changes: t }) {
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
export { Mr as PlanDiffView, hr as PlanEditor, qe as bypassTemplate, wr as createMemoryHub, E as fromEditorBlocks, Tr as localTransport, W as planSchema, D as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map