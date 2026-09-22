import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useState as u, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as d, PLAN_FRAGMENT as ne, diffPlans as re, findSectionSlot as f, isRequiredAt as ie, newId as p, parseBlock as ae, previewProposal as oe, refineInputs as se, settledCount as ce, templateFor as le, toPlanDocument as ue, usesOf as de, validatePlan as fe } from "@re-cinq/planning-document";
import { offset as pe } from "@floating-ui/react";
import { SideMenuExtension as me } from "@blocknote/core/extensions";
import { SideMenu as he, SideMenuController as ge, SuggestionMenuController as _e, createReactBlockSpec as m, useBlockNoteEditor as h, useCreateBlockNote as ve, useEditorChange as g, useExtensionState as ye } from "@blocknote/react";
import { BlockNoteSchema as be, createExtension as xe, filterSuggestionItems as Se, insertOrUpdateBlockForSlashMenu as Ce } from "@blocknote/core";
import { Plugin as we } from "prosemirror-state";
import { ySyncPluginKey as Te } from "y-prosemirror";
import { Fragment as Ee, jsx as _, jsxs as v } from "react/jsx-runtime";
import { PROSE_BLOCK_SPECS as De, acceptRefine as Oe, askRefine as ke, discardRefine as Ae, docFromBlocks as je, fromBase64 as y, proposalsIn as Me, readBlocks as Ne, toBase64 as b } from "@re-cinq/planning-yjs";
import { Awareness as Pe, applyAwarenessUpdate as Fe, encodeAwarenessUpdate as x } from "y-protocols/awareness";
import { Doc as Ie, applyUpdate as S, encodeStateAsUpdate as Le } from "yjs";
import { withCollaboration as Re } from "@blocknote/core/yjs";
//#region src/blocks/adapters.ts
var ze = n({}), Be = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function C() {
	return i(Be);
}
//#endregion
//#region src/template/template-guard.ts
var Ve = "planTemplateBypass", He = "section-heading", Ue = "blockContent", w = [
	"plan-title",
	He,
	"section-panel",
	"section-actions"
], We = xe({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new we({ filterTransaction: Ke })]
});
function Ge(e, t) {
	return e.setMeta(Ve, t);
}
function Ke(e, t) {
	if (!e.docChanged || qe(e)) return !0;
	let n = T(t.doc), r = T(e.doc);
	return Ze(Ye(n), Ye(r)) && Xe(n, r);
}
function qe(e) {
	let t = e.getMeta(Te);
	return !!e.getMeta(Ve) || t?.isChangeOrigin === !0;
}
function T(e) {
	let t = [];
	return e.descendants((e) => {
		Je(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function Je(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(Ue);
}
function Ye(e) {
	return e.filter((e) => w.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function Xe(e, t) {
	return E(t) === 0 || E(e) > 0;
}
function E(e) {
	let t = e.findIndex((e) => e.type === He);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Ze(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Qe = { useFloatingOptions: {
	placement: "left-start",
	middleware: [pe(({ elements: e, rects: t }) => {
		let n = tt(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function $e() {
	return /* @__PURE__ */ _(ge, {
		floatingUIOptions: Qe,
		sideMenu: et
	});
}
function et() {
	let e = ye(me, { selector: (e) => e?.block.type });
	return e === void 0 || w.includes(e) ? null : /* @__PURE__ */ _(he, {});
}
function tt(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? nt(t) : null;
}
function nt(e) {
	let t = rt(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function rt(e) {
	let t = it(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && at(n);
}
function it(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function at(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function ot(e) {
	return e;
}
function D(e) {
	return e.map(ae);
}
function O(e, t) {
	return ue(D(e), t);
}
var k = {
	comment: "_comment_xr1pj_1",
	text: "_text_xr1pj_23",
	who: "_who_xr1pj_27",
	author: "_author_xr1pj_36",
	when: "_when_xr1pj_40",
	badge: "_badge_xr1pj_44",
	actions: "_actions_xr1pj_54",
	reply: "_reply_xr1pj_78",
	input: "_input_xr1pj_82"
}, st = { props: { resolved: !0 } }, ct = { props: { resolved: !1 } };
function lt({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = _t(j(e));
	return /* @__PURE__ */ v("aside", {
		className: k.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${M(e)}`,
		...ut({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ _(dt, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ _("div", {
				className: k.text,
				ref: n
			}),
			!r && t.isEditable && /* @__PURE__ */ _(ft, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function ut({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function dt({ block: e, resolved: t }) {
	return /* @__PURE__ */ v("p", {
		className: k.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: k.author,
				children: M(e)
			}),
			/* @__PURE__ */ _("time", {
				className: k.when,
				children: St(e.props.at)
			}),
			t && /* @__PURE__ */ _("span", {
				className: k.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function ft({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ _("div", {
		className: k.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ _(A, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, ct)
		}) : /* @__PURE__ */ _(pt, {
			block: e,
			editor: t
		})
	});
}
function pt({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ v(Ee, { children: [n ? /* @__PURE__ */ _(mt, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ _(A, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ _(A, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, st)
	})] });
}
function A({ label: e, onClick: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function mt({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = gt({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ _("form", {
		className: k.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ _(ht, {
			to: M(e),
			draft: r,
			onDraft: i
		})
	});
}
function ht({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ _("input", {
		className: k.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function gt({ editor: e, block: t }) {
	let { user: n } = C(), r = h();
	return (i) => {
		if (!i) return;
		let a = j(t), o = r.document, s = yt(o, a) ?? t;
		e.insertBlocks([xt(a, i, n.name)], s, "after");
	};
}
function _t(e) {
	let t = h(), n = () => vt(t.document, e), [r, i] = u(n);
	return g(() => i(n())), r;
}
function vt(e, t) {
	return e.some((e) => bt(e) && j(e) === t && e.props.resolved === !0);
}
function yt(e, t) {
	return e.filter((e) => e.type === "comment" && j(e) === t).at(-1);
}
function bt(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function j(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function M(e) {
	return String(e.props.author || "Someone");
}
function xt(e, t, n) {
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
function St(e) {
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
function Ct({ block: e }) {
	let { renderMockup: t } = o(ze);
	return /* @__PURE__ */ v("figure", {
		className: N.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ v("figcaption", {
			className: N.label,
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
var wt = {
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
}, Tt = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function Et({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: P.steps,
		disabled: r
	};
	return /* @__PURE__ */ v("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ _("legend", {
			className: P.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ _(Dt, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function Dt({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ v("label", {
		className: P.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ _("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), Tt[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var Ot = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function kt(e, t) {
	return e[String(t)] ?? String(t);
}
var F = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function At({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ v("span", {
		className: F.field,
		"data-field": e,
		children: [/* @__PURE__ */ _("label", {
			className: F.label,
			htmlFor: n,
			children: kt(Ot, e)
		}), /* @__PURE__ */ _(jt, {
			...t,
			id: n
		})]
	});
}
function jt(e) {
	return e.spec.values ? /* @__PURE__ */ _(Mt, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ _(Nt, { ...e });
}
function Mt({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ _("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ _("option", { children: e }, e))
	});
}
function Nt({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ _("input", {
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
var Pt = { maturity: Et };
function Ft({ block: e, editor: t, contentRef: n }) {
	let r = wt[e.type];
	return /* @__PURE__ */ v("div", {
		className: N.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ _(It, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ _("div", {
			className: N.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function It({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ v("div", {
		className: N.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ v("p", {
			className: N.head,
			children: [/* @__PURE__ */ _("span", {
				className: N.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ _(Lt, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ _(Rt, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function Lt({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ v("a", {
		className: N.link,
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
function Rt({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(Pt[n] ?? At, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var zt = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function Bt({ contentRef: e }) {
	return /* @__PURE__ */ _("h1", {
		className: zt.title,
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
function Vt({ block: e, editor: t, contentRef: n }) {
	let r = Jt(e.props.options);
	return /* @__PURE__ */ v("div", {
		className: I.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ _(Ht, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ _("div", {
				className: I.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ _(Ut, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Ht({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ _("p", {
		className: I.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ _("span", {
			className: I.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ v("p", {
		className: I.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ _("span", {
				className: I.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ _("span", {
				className: I.why,
				children: e
			}),
			/* @__PURE__ */ _("span", {
				className: I.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Ut({ block: e, editor: t, options: n }) {
	return Xt(Qt(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ _(Wt, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ _(Kt, {
		block: e,
		editor: t
	});
}
function Wt({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ _("ul", {
		className: I.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ _("li", { children: /* @__PURE__ */ _(Gt, {
			onPick: () => Yt(t, e, n),
			children: n
		}) }, n))
	});
}
function Gt({ onPick: e, children: t }) {
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: I.suggestion,
		onClick: e,
		children: t
	});
}
function Kt({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ v("form", {
		className: I.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Yt(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ _(qt, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ _("button", {
			type: "submit",
			className: I.answerButton,
			children: "Answer"
		})]
	});
}
function qt({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ _("input", {
		className: I.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Jt(e) {
	return String(e ?? "").split(",").map((e) => e.trim()).filter(Boolean);
}
function Yt(e, t, n) {
	if (!n) return;
	let r = Qt(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Xt(e) {
	let t = h(), [n, r] = u(() => Zt(t.document, e));
	return g(() => r(Zt(t.document, e))), n;
}
function Zt(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function Qt(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var L = n(null), $t = n(/* @__PURE__ */ new Map());
function R(e) {
	let t = o(L), n = o($t).get(e);
	return t ? f(t, e, n) : void 0;
}
//#endregion
//#region src/session/use-section-refine.ts
var z = /* @__PURE__ */ new WeakMap();
function en(e, t) {
	let n = nn(e);
	return l(() => {
		let n = rn(e), r = se(n, t), i = Me(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ce(r),
			proposal: i,
			preview: i?.status === "proposed" ? oe(n, i) : void 0,
			...tn(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function tn(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: de(n),
			baseHash: ke(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void Oe(e, t),
		discard: () => Ae(e, t)
	};
}
function nn(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function rn(e) {
	let t = z.get(e);
	if (t) return t;
	let n = Ne(e);
	return z.set(e, n), e.once("update", () => z.delete(e)), n;
}
var B = {
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
function an(e) {
	let t = en(e.doc, e.slot), n = on(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ _(ln, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ _(cn, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ _(sn, { ...r });
}
function on({ slot: e, title: t }, n) {
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
function sn({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ v("p", {
		className: B.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: B.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ _("span", {
			className: B.note,
			children: n ? `uses ${pn(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function cn({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ v("p", {
		className: B.bar,
		role: "status",
		children: [/* @__PURE__ */ v("span", {
			className: B.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: B.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function ln({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ v("section", {
		className: B.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ v("p", {
				className: B.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					mn(r)
				]
			}),
			/* @__PURE__ */ _(dn, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ v("p", {
				className: B.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ _(un, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function un({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ v("p", {
		className: B.bar,
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: B.refine,
			onClick: i,
			children: r
		}), /* @__PURE__ */ _("button", {
			type: "button",
			className: B.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function dn({ lines: e }) {
	return /* @__PURE__ */ _("ul", {
		className: B.lines,
		children: e.map((e, t) => /* @__PURE__ */ _("li", {
			className: B[e.kind],
			children: /* @__PURE__ */ _(fn, { line: e })
		}, `${t}-${e.text}`))
	});
}
function fn({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ _("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ _("del", { children: e.text }) : e.text;
}
function pn({ inputs: e }) {
	return V(e.answered.length, e.resolved.length);
}
function mn({ uses: e }) {
	let t = V(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function V(e, t) {
	return [hn(e, "answer"), hn(t, "resolved thread")].filter(Boolean).join(", ");
}
function hn(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var gn = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function _n({ block: e, editor: t }) {
	let { slot: n, title: r } = vn(e), { onRefine: i, doc: a } = C();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ _("div", {
		role: "group",
		className: gn.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ _(an, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function vn(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: R(t)?.title ?? t
	};
}
var H = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function yn({ block: e }) {
	let t = R(e.props.slot);
	return /* @__PURE__ */ v("header", {
		className: H.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ _("h2", {
			className: H.title,
			children: e.props.title
		}), t && /* @__PURE__ */ _("p", {
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
function bn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = R(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ _("aside", {
		className: U.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ _(xn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function xn({ block: e, editor: t, title: n }) {
	let { user: r } = C(), [i, a] = u("");
	return /* @__PURE__ */ v("form", {
		className: U.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(Cn({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ _("input", {
			className: U.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ _(Sn, {})]
	});
}
function Sn() {
	return /* @__PURE__ */ _("button", {
		type: "submit",
		className: U.send,
		children: "Comment"
	});
}
function Cn({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([wn(n, r)], e, "before"), "");
}
function wn(e, t) {
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
var W = { render: Ft }, Tn = {
	"plan-title": m(d["plan-title"], { render: Bt })(),
	"section-heading": m(d["section-heading"], { render: yn })(),
	"section-panel": m(d["section-panel"], { render: bn })(),
	"section-actions": m(d["section-actions"], { render: _n })(),
	comment: m(d.comment, { render: lt })(),
	kpi: m(d.kpi, W)(),
	prototype: m(d.prototype, W)(),
	mockup: m(d.mockup, { render: Ct })(),
	question: m(d.question, { render: Vt })(),
	answer: m(d.answer, W)()
}, G = be.create({ blockSpecs: {
	...De,
	...Tn
} });
//#endregion
//#region src/menu/section-context.ts
function En(e, t) {
	let [n] = On(e, t);
	return n ? String(n.props.slot) : null;
}
function Dn(e, t) {
	let n = On(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function On(e, t) {
	let n = e.slice(0, kn(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function kn(e, t) {
	return e.findIndex((e) => An(e, t));
}
function An(e, t) {
	return e.id === t || e.children.some((e) => An(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var K = "Text", q = "Plan", jn = { cells: [
	"",
	"",
	""
] }, Mn = [
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
			rows: [jn, jn]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: q,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: p("kpi") })
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
		props: () => ({ questionId: p("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: q,
		props: (e) => {
			let t = Dn(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function Nn(e, t) {
	return Mn.filter((t) => e.allows.includes(t.kind)).flatMap((e) => Pn(e, t));
}
function Pn(e, t) {
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
function Fn() {
	let e = h(G), t = o(L);
	return /* @__PURE__ */ _(_e, {
		triggerCharacter: "/",
		getItems: async (n) => Se(In(e, t), n)
	});
}
function In(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = {
		blocks: n,
		cursorId: r.id
	}, a = t && Ln(t, i);
	return a ? Nn(a, i).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Ce(e, ot(t))
	})) : [];
}
function Ln(e, { blocks: t, cursorId: n }) {
	let r = En(t, n);
	return r === null ? void 0 : f(e, r);
}
//#endregion
//#region src/outline/outline-sections.ts
function Rn(e, t, n) {
	let r = new Set(t.map((e) => e.slot)), i = e.slots.filter((e) => !r.has(e.slot));
	return [...t, ...i].map((t) => zn(e, t, n));
}
function zn(e, { slot: t, title: n }, r) {
	let i = e.slots.find((e) => e.slot === t);
	return {
		slot: t,
		title: n || i?.title || t,
		required: i !== void 0 && ie(i.required, r)
	};
}
//#endregion
//#region src/outline/problems-by-slot.ts
function Bn(e) {
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
}, Vn = [];
function Hn({ template: e, report: t, sections: n = Vn, children: r }) {
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
			/* @__PURE__ */ _(Un, {
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
function Un({ template: e, report: t, sections: n }) {
	let r = Bn(t.problems);
	return /* @__PURE__ */ _("ol", {
		className: J.slots,
		children: Rn(e, n, t.phase).map((e) => /* @__PURE__ */ _(Wn, {
			section: e,
			problems: r.get(e.slot) ?? []
		}, e.slot))
	});
}
function Wn({ section: e, problems: t }) {
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
function Gn(e, t) {
	return [...e].flatMap(([e, { user: n, editing: r }]) => e === t || !n ? [] : [Kn(e, n, r)]);
}
function Kn(e, t, n) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: qn(n)
	};
}
function qn(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
function Jn(e, t, n) {
	let r = e.slot && f(t, e.slot, n.get(e.slot));
	return r ? `${e.name} in ${r.title}` : e.name;
}
//#endregion
//#region src/presence/use-presence.ts
function Yn(e) {
	let [t, n] = u(() => Zn(e));
	return s(() => {
		let t = () => n(Zn(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function Xn(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: En(r, n.id) });
	}), [e, t]);
}
function Zn(e) {
	return Gn(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/PresenceBar.tsx
function Qn({ awareness: e, template: t, titles: n }) {
	let r = Yn(e);
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
			}), Jn(e, t, n)]
		}, e.clientId))
	});
}
var $n = { notice: "_notice_1xdcv_1" }, er = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function Z({ status: e, reason: t }) {
	return /* @__PURE__ */ v("p", {
		className: $n.notice,
		role: "status",
		"data-status": e,
		children: [er[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/plan-session.ts
var Q = "plan-transport";
function tr(e) {
	let t = new Ie(), n = {
		doc: t,
		awareness: new Pe(t)
	}, r = rr({
		status: "connecting",
		meta: null
	});
	or(n, e);
	let i = e.subscribe((e) => ar({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => nr(n, i)
	};
}
function nr({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function rr(e) {
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
var ir = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		S(e, y(n), Q), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => S(e, y(t), Q),
	awareness: ({ awareness: e }, { update: t }) => Fe(e, y(t), Q),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function ar(e, t) {
	ir[t.type](e, t);
}
function or({ doc: t, awareness: n }, r) {
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
function sr(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = tr(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function cr(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/use-plan-editor.ts
function lr({ session: e, meta: t, user: n, onChange: r }) {
	let i = ur(e, n), o = dr(i, e, a((e) => r?.(O(e, t)), [t, r]));
	return {
		editor: i,
		plan: l(() => O(o, t), [o, t])
	};
}
function ur(e, t) {
	let { doc: n } = e;
	return ve(Re({
		schema: G,
		extensions: [We],
		collaboration: {
			fragment: n.getXmlFragment(ne),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function dr(e, t, n) {
	let [r, i] = u(() => Ne(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var fr = {};
function pr({ transport: e, adapters: t = fr, className: n, ...r }) {
	let i = sr(e);
	return /* @__PURE__ */ _(ze, {
		value: t,
		children: /* @__PURE__ */ _("div", {
			className: mr({
				...r,
				className: n
			}),
			children: i ? /* @__PURE__ */ _(hr, {
				...r,
				session: i
			}) : /* @__PURE__ */ _(Z, { status: "connecting" })
		})
	});
}
function mr({ showOutline: e, className: t }) {
	let n = e === !1 ? Y.single : Y.withOutline;
	return [
		Y.editor,
		n,
		"ps-editor",
		t
	].filter(Boolean).join(" ");
}
function hr({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = cr(t.session);
	if (!r) return /* @__PURE__ */ _(Z, {
		status: n,
		reason: i
	});
	let a = e ?? le(r.type);
	return /* @__PURE__ */ v(L, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ _(Z, {
			status: n,
			reason: i
		}), /* @__PURE__ */ _(gr, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function gr({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s } = lr(r), c = xr(s, e, t), { awareness: l } = i;
	Xn(o, l);
	let u = {
		...r,
		editor: o,
		awareness: l,
		report: c,
		sections: s.sections
	};
	return /* @__PURE__ */ _(Be, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ _(_r, { ...u })
	});
}
function _r({ showOutline: e = !0, showPresence: t = !0, ...n }) {
	let r = vr(n.sections);
	return /* @__PURE__ */ v($t, {
		value: r,
		children: [
			t && /* @__PURE__ */ _(Qn, {
				...n,
				titles: r
			}),
			/* @__PURE__ */ _(br, { ...n }),
			e && /* @__PURE__ */ _(yr, { ...n })
		]
	});
}
function vr(e) {
	return l(() => new Map(e.map((e) => [e.slot, e.title])), [e]);
}
function yr({ template: e, report: t, sections: n, outlineFooter: r }) {
	return /* @__PURE__ */ _(Hn, {
		template: e,
		report: t,
		sections: n,
		children: r
	});
}
function br({ editor: e, readOnly: t }) {
	return /* @__PURE__ */ v(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [/* @__PURE__ */ _(Fn, {}), /* @__PURE__ */ _($e, {})]
	});
}
function xr(e, t, n) {
	let r = l(() => fe(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
//#endregion
//#region src/session/memory-hub.ts
function Sr(e) {
	let t = je(e.blocks), n = new Pe(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return wr(r), {
		doc: t,
		connect: () => Er(r)
	};
}
function Cr(e) {
	return Sr(e).connect();
}
function wr(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => Tr(t, n, {
		type: "update",
		update: b(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		Tr(t, i, {
			type: "awareness",
			update: b(a)
		});
	});
}
function Tr(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function Er(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => Dr(e, t, n),
		subscribe: (n) => (t.handlers.add(n), Or(e, n), () => t.handlers.delete(n))
	};
}
function Dr(e, t, n) {
	if (n.type === "update") {
		S(e.doc, y(n.update), t);
		return;
	}
	Fe(e.awareness, y(n.update), t);
}
function Or({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: b(Le(e))
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
}, kr = {
	kept: " ",
	added: "+",
	removed: "-"
};
function Ar({ before: e, after: t, className: n }) {
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
			/* @__PURE__ */ _(jr, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ _(Mr, { section: e }, e.slot)),
			/* @__PURE__ */ _(Nr, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function jr({ changes: e }) {
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
function Mr({ section: e }) {
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
					children: [kr[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function Nr({ what: e, changes: t }) {
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
export { Ar as PlanDiffView, pr as PlanEditor, Ge as bypassTemplate, Sr as createMemoryHub, D as fromEditorBlocks, Cr as localTransport, G as planSchema, O as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map