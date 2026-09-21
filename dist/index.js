import { n as e, t } from "./plan-provider-DncO1qbp.js";
import { createContext as n, createElement as r, use as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useState as u, useSyncExternalStore as ee } from "react";
import { BlockNoteView as te } from "@blocknote/ariakit";
import { PLAN_BLOCK_CONFIGS as d, PLAN_FRAGMENT as ne, diffPlans as re, isRequiredAt as ie, newId as f, parseBlock as ae, previewProposal as oe, refineInputs as se, settledCount as ce, templateFor as le, toPlanDocument as ue, usesOf as de, validatePlan as fe } from "@re-cinq/planning-document";
import { offset as pe } from "@floating-ui/react";
import { SideMenuController as me, SuggestionMenuController as he, createReactBlockSpec as p, useBlockNoteEditor as m, useCreateBlockNote as ge, useEditorChange as _e } from "@blocknote/react";
import { Fragment as ve, jsx as h, jsxs as g } from "react/jsx-runtime";
import { BlockNoteSchema as ye, createExtension as be, filterSuggestionItems as xe, insertOrUpdateBlockForSlashMenu as Se } from "@blocknote/core";
import { PROSE_BLOCK_SPECS as Ce, acceptRefine as we, askRefine as Te, discardRefine as Ee, docFromBlocks as De, fromBase64 as _, proposalsIn as Oe, readBlocks as v, toBase64 as y } from "@re-cinq/planning-yjs";
import { Awareness as b, applyAwarenessUpdate as ke, encodeAwarenessUpdate as x } from "y-protocols/awareness";
import { Doc as Ae, applyUpdate as S, encodeStateAsUpdate as je } from "yjs";
import { withCollaboration as Me } from "@blocknote/core/yjs";
import { Plugin as Ne } from "prosemirror-state";
import { ySyncPluginKey as Pe } from "y-prosemirror";
//#region src/blocks/adapters.ts
var C = n({}), Fe = n({ user: {
	id: "",
	name: "Someone",
	color: "currentColor"
} });
function w() {
	return i(Fe);
}
//#endregion
//#region src/menu/PlanSideMenu.tsx
var Ie = { useFloatingOptions: {
	placement: "left-start",
	middleware: [pe(({ elements: e, rects: t }) => {
		let n = Re(e.reference);
		return { crossAxis: n ? n - t.floating.height / 2 : 0 };
	})]
} };
function Le() {
	return /* @__PURE__ */ h(me, { floatingUIOptions: Ie });
}
function Re(e) {
	let t = e instanceof Element ? e : e.contextElement;
	return t ? ze(t) : null;
}
function ze(e) {
	let t = Be(e);
	return t && t.top + t.height / 2 - e.getBoundingClientRect().top;
}
function Be(e) {
	let t = Ve(e);
	if (t) {
		let e = document.createRange();
		return e.selectNodeContents(t), e.getClientRects()[0] ?? null;
	}
	let n = e.querySelector(".bn-inline-content");
	return n && He(n);
}
function Ve(e) {
	return document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (e) => e.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode();
}
function He(e) {
	let { top: t, left: n, width: r } = e.getBoundingClientRect(), i = parseFloat(getComputedStyle(e).lineHeight);
	return new DOMRect(n, t, r, i);
}
//#endregion
//#region src/schema/block-bridge.ts
function Ue(e) {
	return e;
}
function We(e) {
	return e.map(ae);
}
function T(e, t) {
	return ue(We(e), t);
}
var E = {
	comment: "_comment_xr1pj_1",
	text: "_text_xr1pj_23",
	who: "_who_xr1pj_27",
	author: "_author_xr1pj_36",
	when: "_when_xr1pj_40",
	badge: "_badge_xr1pj_44",
	actions: "_actions_xr1pj_54",
	reply: "_reply_xr1pj_78",
	input: "_input_xr1pj_82"
}, Ge = { props: { resolved: !0 } }, Ke = { props: { resolved: !1 } };
function qe({ block: e, editor: t, contentRef: n }) {
	let r = !!e.props.replyTo, i = tt(O(e));
	return /* @__PURE__ */ g("aside", {
		className: E.comment,
		"data-kind": "comment",
		"aria-label": `Comment by ${k(e)}`,
		...Je({
			isReply: r,
			resolved: i
		}),
		children: [
			/* @__PURE__ */ h(Ye, {
				block: e,
				resolved: i && !r
			}),
			/* @__PURE__ */ h("div", {
				className: E.text,
				ref: n
			}),
			!r && t.isEditable && /* @__PURE__ */ h(Xe, {
				block: e,
				editor: t,
				resolved: i
			})
		]
	});
}
function Je({ isReply: e, resolved: t }) {
	return {
		"data-reply": e || void 0,
		"data-resolved": t || void 0,
		hidden: e && t
	};
}
function Ye({ block: e, resolved: t }) {
	return /* @__PURE__ */ g("p", {
		className: E.who,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: E.author,
				children: k(e)
			}),
			/* @__PURE__ */ h("time", {
				className: E.when,
				children: ot(e.props.at)
			}),
			t && /* @__PURE__ */ h("span", {
				className: E.badge,
				children: e.props.used === !0 ? "In the plan" : "Resolved"
			})
		]
	});
}
function Xe({ block: e, editor: t, resolved: n }) {
	return /* @__PURE__ */ h("div", {
		className: E.actions,
		contentEditable: !1,
		children: n ? /* @__PURE__ */ h(D, {
			label: "Reopen",
			onClick: () => t.updateBlock(e, Ke)
		}) : /* @__PURE__ */ h(Ze, {
			block: e,
			editor: t
		})
	});
}
function Ze({ block: e, editor: t }) {
	let [n, r] = u(!1);
	return /* @__PURE__ */ g(ve, { children: [n ? /* @__PURE__ */ h(Qe, {
		block: e,
		editor: t,
		onDone: () => r(!1)
	}) : /* @__PURE__ */ h(D, {
		label: "Reply",
		onClick: () => r(!0)
	}), /* @__PURE__ */ h(D, {
		label: "Resolve",
		onClick: () => t.updateBlock(e, Ge)
	})] });
}
function D({ label: e, onClick: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		onClick: t,
		children: e
	});
}
function Qe({ block: e, editor: t, onDone: n }) {
	let [r, i] = u(""), a = et({
		editor: t,
		block: e
	});
	return /* @__PURE__ */ h("form", {
		className: E.reply,
		onSubmit: (e) => {
			e.preventDefault(), a(r.trim()), n();
		},
		children: /* @__PURE__ */ h($e, {
			to: k(e),
			draft: r,
			onDraft: i
		})
	});
}
function $e({ to: e, draft: t, onDraft: n }) {
	return /* @__PURE__ */ h("input", {
		className: E.input,
		value: t,
		"aria-label": `Reply to ${e}`,
		placeholder: "Reply",
		autoFocus: !0,
		onChange: (e) => n(e.target.value)
	});
}
function et({ editor: e, block: t }) {
	let { user: n } = w(), r = m();
	return (i) => {
		if (!i) return;
		let a = O(t), o = r.document, s = rt(o, a) ?? t;
		e.insertBlocks([at(a, i, n.name)], s, "after");
	};
}
function tt(e) {
	let t = m(), n = () => nt(t.document, e), [r, i] = u(n);
	return _e(() => i(n())), r;
}
function nt(e, t) {
	return e.some((e) => it(e) && O(e) === t && e.props.resolved === !0);
}
function rt(e, t) {
	return e.filter((e) => e.type === "comment" && O(e) === t).at(-1);
}
function it(e) {
	return e.type === "comment" && !e.props.replyTo;
}
function O(e) {
	return String(e.props.replyTo || e.props.commentId || e.id);
}
function k(e) {
	return String(e.props.author || "Someone");
}
function at(e, t, n) {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		type: "comment",
		props: {
			commentId: f("cmt"),
			replyTo: e,
			author: n,
			at: r
		},
		content: t
	};
}
function ot(e) {
	let t = new Date(String(e));
	return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
var A = {
	block: "_block_rplr1_1",
	meta: "_meta_rplr1_7",
	head: "_head_rplr1_15",
	label: "_label_rplr1_23",
	link: "_link_rplr1_28",
	content: "_content_rplr1_39"
};
//#endregion
//#region src/blocks/MockupView.tsx
function st({ block: e }) {
	let { renderMockup: t } = o(C);
	return /* @__PURE__ */ g("figure", {
		className: A.block,
		"data-kind": "mockup",
		contentEditable: !1,
		children: [/* @__PURE__ */ g("figcaption", {
			className: A.label,
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
var ct = {
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
}, j = {
	steps: "_steps_1muc5_1",
	legend: "_legend_1muc5_11",
	step: "_step_1muc5_1"
}, lt = {
	none: "Nothing yet",
	"click-dummy": "Click-dummy",
	"running-prototype": "Running prototype",
	"pre-prod": "Pre-prod"
};
function ut({ spec: e, value: t, onChange: n, readOnly: r }) {
	let i = c(), a = e.values ?? [], o = a.indexOf(String(t)), s = {
		className: j.steps,
		disabled: r
	};
	return /* @__PURE__ */ g("fieldset", {
		...s,
		"data-field": "maturity",
		children: [/* @__PURE__ */ h("legend", {
			className: j.legend,
			children: "Maturity"
		}), a.map((e, t) => /* @__PURE__ */ h(dt, {
			group: i,
			step: e,
			onChange: n,
			at: t - o
		}, e))]
	});
}
function dt({ group: e, step: t, at: n, onChange: r }) {
	return /* @__PURE__ */ g("label", {
		className: j.step,
		"data-reached": n <= 0 || void 0,
		children: [/* @__PURE__ */ h("input", {
			type: "radio",
			name: e,
			value: t,
			checked: n === 0,
			onChange: () => r(t)
		}), lt[t] ?? t]
	});
}
//#endregion
//#region src/blocks/labels.ts
var ft = {
	metric: "Metric",
	baseline: "Baseline",
	target: "Target",
	direction: "Direction",
	deadline: "Deadline",
	maturity: "Maturity",
	url: "Link",
	agreedBy: "Agreed by"
};
function pt(e, t) {
	return e[String(t)] ?? String(t);
}
var M = {
	field: "_field_25ht0_1",
	label: "_label_25ht0_7",
	input: "_input_25ht0_12"
};
//#endregion
//#region src/blocks/PropField.tsx
function mt({ name: e, ...t }) {
	let n = c();
	return /* @__PURE__ */ g("span", {
		className: M.field,
		"data-field": e,
		children: [/* @__PURE__ */ h("label", {
			className: M.label,
			htmlFor: n,
			children: pt(ft, e)
		}), /* @__PURE__ */ h(ht, {
			...t,
			id: n
		})]
	});
}
function ht(e) {
	return e.spec.values ? /* @__PURE__ */ h(gt, {
		...e,
		values: e.spec.values
	}) : /* @__PURE__ */ h(_t, { ...e });
}
function gt({ id: e, value: t, values: n, onChange: r, readOnly: i }) {
	return /* @__PURE__ */ h("select", {
		id: e,
		value: String(t),
		disabled: i,
		onChange: (e) => r(e.target.value),
		children: n.map((e) => /* @__PURE__ */ h("option", { children: e }, e))
	});
}
function _t({ id: e, spec: t, value: n, onChange: r, readOnly: i }) {
	let a = typeof t.default == "number", o = (e) => a ? Number(e.target.value) : e.target.value;
	return /* @__PURE__ */ h("input", {
		id: e,
		className: M.input,
		type: a ? "number" : "text",
		value: String(n ?? ""),
		readOnly: i,
		onChange: (e) => r(o(e))
	});
}
//#endregion
//#region src/blocks/PlanBlockView.tsx
var vt = { maturity: ut };
function yt({ block: e, editor: t, contentRef: n }) {
	let r = ct[e.type];
	return /* @__PURE__ */ g("div", {
		className: A.block,
		"data-kind": e.type,
		children: [/* @__PURE__ */ h(bt, {
			block: e,
			editor: t,
			view: r
		}), n && /* @__PURE__ */ h("div", {
			className: A.content,
			ref: n,
			"data-placeholder": r.placeholder
		})]
	});
}
function bt({ block: e, editor: t, view: n }) {
	let r = !t.isEditable;
	return /* @__PURE__ */ g("div", {
		className: A.meta,
		contentEditable: !1,
		children: [/* @__PURE__ */ g("p", {
			className: A.head,
			children: [/* @__PURE__ */ h("span", {
				className: A.label,
				children: n.label(e.props)
			}), /* @__PURE__ */ h(xt, {
				view: n,
				props: e.props
			})]
		}), n.fields.map((n) => /* @__PURE__ */ h(St, {
			block: e,
			editor: t,
			name: n,
			readOnly: r
		}, n))]
	});
}
function xt({ view: e, props: t }) {
	let n = e.link?.href(t) ?? "";
	return n && /* @__PURE__ */ g("a", {
		className: A.link,
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
function St({ block: e, editor: t, name: n, readOnly: i }) {
	let { propSchema: a } = d[e.type], o = a;
	return r(vt[n] ?? mt, {
		name: n,
		spec: o[n] ?? { default: "" },
		value: e.props[n],
		readOnly: i,
		onChange: (r) => t.updateBlock(e, { props: { [n]: r } })
	});
}
var Ct = { title: "_title_1clq6_1" };
//#endregion
//#region src/blocks/PlanTitleView.tsx
function wt({ contentRef: e }) {
	return /* @__PURE__ */ h("h1", {
		className: Ct.title,
		ref: e,
		"data-placeholder": "Name this feature"
	});
}
var N = {
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
function Tt({ block: e, editor: t, contentRef: n }) {
	let r = Mt(e.props.options);
	return /* @__PURE__ */ g("div", {
		className: N.question,
		"data-kind": "question",
		children: [
			/* @__PURE__ */ h(Et, {
				why: String(e.props.why ?? ""),
				picks: r.length > 0,
				used: e.props.used === !0
			}),
			/* @__PURE__ */ h("div", {
				className: N.text,
				ref: n,
				"data-placeholder": "What the plan still has to decide"
			}),
			/* @__PURE__ */ h(Dt, {
				block: e,
				editor: t,
				options: r
			})
		]
	});
}
function Et({ why: e, picks: t, used: n }) {
	return n ? /* @__PURE__ */ h("p", {
		className: N.asked,
		contentEditable: !1,
		children: /* @__PURE__ */ h("span", {
			className: N.label,
			children: "Question · in the plan"
		})
	}) : /* @__PURE__ */ g("p", {
		className: N.asked,
		contentEditable: !1,
		children: [
			/* @__PURE__ */ h("span", {
				className: N.label,
				children: "Question"
			}),
			e && /* @__PURE__ */ h("span", {
				className: N.why,
				children: e
			}),
			/* @__PURE__ */ h("span", {
				className: N.how,
				children: t ? "Pick one" : "Write the answer"
			})
		]
	});
}
function Dt({ block: e, editor: t, options: n }) {
	return Pt(P(e)) || !t.isEditable ? null : n.length > 0 ? /* @__PURE__ */ h(Ot, {
		block: e,
		editor: t,
		options: n
	}) : /* @__PURE__ */ h(At, {
		block: e,
		editor: t
	});
}
function Ot({ block: e, editor: t, options: n }) {
	return /* @__PURE__ */ h("ul", {
		className: N.suggestions,
		contentEditable: !1,
		children: n.map((n) => /* @__PURE__ */ h("li", { children: /* @__PURE__ */ h(kt, {
			onPick: () => Nt(t, e, n),
			children: n
		}) }, n))
	});
}
function kt({ onPick: e, children: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: N.suggestion,
		onClick: e,
		children: t
	});
}
function At({ block: e, editor: t }) {
	let [n, r] = u("");
	return /* @__PURE__ */ g("form", {
		className: N.answerBox,
		onSubmit: (r) => {
			r.preventDefault(), Nt(t, e, n.trim());
		},
		contentEditable: !1,
		children: [/* @__PURE__ */ h(jt, {
			draft: n,
			onDraft: r
		}), /* @__PURE__ */ h("button", {
			type: "submit",
			className: N.answerButton,
			children: "Answer"
		})]
	});
}
function jt({ draft: e, onDraft: t }) {
	return /* @__PURE__ */ h("input", {
		className: N.answerInput,
		value: e,
		"aria-label": "Your answer",
		placeholder: "Type your answer",
		onChange: (e) => t(e.target.value)
	});
}
function Mt(e) {
	return String(e ?? "").split(",").map((e) => e.trim()).filter(Boolean);
}
function Nt(e, t, n) {
	if (!n) return;
	let r = P(t);
	e.insertBlocks([{
		type: "answer",
		props: { questionId: r },
		content: n
	}], t, "after");
}
function Pt(e) {
	let t = m(), [n, r] = u(() => Ft(t.document, e));
	return _e(() => r(Ft(t.document, e))), n;
}
function Ft(e, t) {
	return e.some((e) => e.type === "answer" && e.props.questionId === t);
}
function P(e) {
	return String(e.props.questionId || e.id);
}
//#endregion
//#region src/template/template-context.ts
var F = n(null);
function I(e) {
	return o(F)?.slots.find((t) => t.slot === e);
}
//#endregion
//#region src/session/use-section-refine.ts
var L = /* @__PURE__ */ new WeakMap();
function It(e, t) {
	let n = Rt(e);
	return l(() => {
		let n = zt(e), r = se(n, t), i = Oe(e).find((e) => e.slot === t);
		return {
			inputs: r,
			settled: ce(r),
			proposal: i,
			preview: i?.status === "proposed" ? oe(n, i) : void 0,
			...Lt(e, t, r)
		};
	}, [
		e,
		t,
		n
	]);
}
function Lt(e, t, n) {
	return {
		ask: (r) => ({
			inputs: n,
			uses: de(n),
			baseHash: Te(e, {
				slot: t,
				askedBy: r
			}).baseHash
		}),
		accept: () => void we(e, t),
		discard: () => Ee(e, t)
	};
}
function Rt(e) {
	let [t, n] = u(0);
	return s(() => {
		let t = () => n((e) => e + 1);
		return e.on("update", t), () => e.off("update", t);
	}, [e]), t;
}
function zt(e) {
	let t = L.get(e);
	if (t) return t;
	let n = v(e);
	return L.set(e, n), e.once("update", () => L.delete(e)), n;
}
var R = {
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
function Bt(e) {
	let t = It(e.doc, e.slot), n = Vt(e, t), r = {
		...e,
		refine: t,
		ask: n
	};
	return t.proposal?.status === "proposed" ? /* @__PURE__ */ h(Wt, {
		...r,
		proposal: t.proposal
	}) : t.proposal?.status === "asked" ? /* @__PURE__ */ h(Ut, {
		...r,
		askedBy: t.proposal.askedBy
	}) : /* @__PURE__ */ h(Ht, { ...r });
}
function Vt({ slot: e, title: t }, n) {
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
function Ht({ refine: e, ask: t }) {
	let n = e.settled > 0;
	return /* @__PURE__ */ g("p", {
		className: R.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: R.refine,
			disabled: !n,
			onClick: t,
			children: "Refine this section"
		}), /* @__PURE__ */ h("span", {
			className: R.note,
			children: n ? `uses ${Jt(e)}` : "Answer a question or resolve a thread to refine"
		})]
	});
}
function Ut({ refine: e, askedBy: t }) {
	return /* @__PURE__ */ g("p", {
		className: R.bar,
		role: "status",
		children: [/* @__PURE__ */ g("span", {
			className: R.note,
			children: [
				"The agent is refining this for ",
				t,
				"…"
			]
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: R.quiet,
			onClick: e.discard,
			children: "Withdraw"
		})]
	});
}
function Wt({ refine: e, ask: t, title: n, proposal: r }) {
	let i = e.preview?.stale ?? !1;
	return /* @__PURE__ */ g("section", {
		className: R.proposal,
		"aria-label": `Proposal for ${n}`,
		children: [
			/* @__PURE__ */ g("p", {
				className: R.note,
				children: [
					"The agent proposes, for ",
					r.askedBy,
					". ",
					Yt(r)
				]
			}),
			/* @__PURE__ */ h(Kt, { lines: e.preview?.lines ?? [] }),
			i && /* @__PURE__ */ g("p", {
				className: R.stale,
				role: "alert",
				children: [
					n,
					" changed after ",
					r.askedBy,
					" asked."
				]
			}),
			/* @__PURE__ */ h(Gt, {
				refine: e,
				ask: t,
				stale: i
			})
		]
	});
}
function Gt({ refine: e, ask: t, stale: n }) {
	let [r, i] = n ? ["Ask again", t] : ["Accept", e.accept];
	return /* @__PURE__ */ g("p", {
		className: R.bar,
		children: [/* @__PURE__ */ h("button", {
			type: "button",
			className: R.refine,
			onClick: i,
			children: r
		}), /* @__PURE__ */ h("button", {
			type: "button",
			className: R.quiet,
			onClick: e.discard,
			children: "Discard"
		})]
	});
}
function Kt({ lines: e }) {
	return /* @__PURE__ */ h("ul", {
		className: R.lines,
		children: e.map((e, t) => /* @__PURE__ */ h("li", {
			className: R[e.kind],
			children: /* @__PURE__ */ h(qt, { line: e })
		}, `${t}-${e.text}`))
	});
}
function qt({ line: e }) {
	return e.kind === "added" ? /* @__PURE__ */ h("ins", { children: e.text }) : e.kind === "removed" ? /* @__PURE__ */ h("del", { children: e.text }) : e.text;
}
function Jt({ inputs: e }) {
	return Xt(e.answered.length, e.resolved.length);
}
function Yt({ uses: e }) {
	let t = Xt(e.questions.length, e.comments.length);
	return t ? `It uses ${t}.` : "";
}
function Xt(e, t) {
	return [Zt(e, "answer"), Zt(t, "resolved thread")].filter(Boolean).join(", ");
}
function Zt(e, t) {
	return e === 0 ? "" : `${e} ${t}${e === 1 ? "" : "s"}`;
}
var Qt = { actions: "_actions_7yxku_1" };
//#endregion
//#region src/blocks/SectionActions.tsx
function $t({ block: e, editor: t }) {
	let { slot: n, title: r } = en(e), { onRefine: i, doc: a } = w();
	return !i || !a || !t.isEditable ? null : /* @__PURE__ */ h("div", {
		role: "group",
		className: Qt.actions,
		"aria-label": `${r} actions`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(Bt, {
			doc: a,
			slot: n,
			title: r
		})
	});
}
function en(e) {
	let t = String(e.props.slot ?? "");
	return {
		slot: t,
		title: I(t)?.title ?? t
	};
}
var z = {
	heading: "_heading_elu6q_1",
	title: "_title_elu6q_9",
	hint: "_hint_elu6q_17"
};
//#endregion
//#region src/blocks/SectionHeading.tsx
function tn({ block: e }) {
	let t = I(e.props.slot);
	return /* @__PURE__ */ g("header", {
		className: z.heading,
		"data-slot": e.props.slot,
		contentEditable: !1,
		children: [/* @__PURE__ */ h("h2", {
			className: z.title,
			children: e.props.title
		}), t && /* @__PURE__ */ h("p", {
			className: z.hint,
			children: t.hint
		})]
	});
}
var B = {
	panel: "_panel_1ajor_1",
	commentBox: "_commentBox_1ajor_11",
	input: "_input_1ajor_17",
	send: "_send_1ajor_34"
};
//#endregion
//#region src/blocks/SectionPanel.tsx
function nn({ block: e, editor: t }) {
	let n = String(e.props.slot ?? ""), r = I(n)?.title ?? n;
	return t.isEditable ? /* @__PURE__ */ h("aside", {
		className: B.panel,
		"data-slot": n,
		"aria-label": `${r} tools`,
		contentEditable: !1,
		children: /* @__PURE__ */ h(rn, {
			block: e,
			editor: t,
			title: r
		})
	}) : null;
}
function rn({ block: e, editor: t, title: n }) {
	let { user: r } = w(), [i, a] = u("");
	return /* @__PURE__ */ g("form", {
		className: B.commentBox,
		onSubmit: (n) => {
			n.preventDefault(), a(on({
				block: e,
				editor: t
			}, i.trim(), r.name));
		},
		children: [/* @__PURE__ */ h("input", {
			className: B.input,
			value: i,
			"aria-label": `Comment on ${n}`,
			placeholder: "Add a comment",
			onChange: (e) => a(e.target.value)
		}), /* @__PURE__ */ h(an, {})]
	});
}
function an() {
	return /* @__PURE__ */ h("button", {
		type: "submit",
		className: B.send,
		children: "Comment"
	});
}
function on({ block: e, editor: t }, n, r) {
	return n && (t.insertBlocks([sn(n, r)], e, "before"), "");
}
function sn(e, t) {
	return {
		type: "comment",
		props: {
			commentId: f("cmt"),
			author: t,
			at: (/* @__PURE__ */ new Date()).toISOString()
		},
		content: e
	};
}
//#endregion
//#region src/blocks/plan-block-specs.tsx
var V = { render: yt }, cn = {
	"plan-title": p(d["plan-title"], { render: wt })(),
	"section-heading": p(d["section-heading"], { render: tn })(),
	"section-panel": p(d["section-panel"], { render: nn })(),
	"section-actions": p(d["section-actions"], { render: $t })(),
	comment: p(d.comment, { render: qe })(),
	kpi: p(d.kpi, V)(),
	prototype: p(d.prototype, V)(),
	mockup: p(d.mockup, { render: st })(),
	question: p(d.question, { render: Tt })(),
	answer: p(d.answer, V)()
}, H = ye.create({ blockSpecs: {
	...Ce,
	...cn
} });
//#endregion
//#region src/menu/section-context.ts
function U(e, t) {
	let [n] = W(e, t);
	return n ? String(n.props.slot) : null;
}
function ln(e, t) {
	let n = W(e, t).findLast((e) => e.type === "question");
	return n ? String(n.props.questionId) : null;
}
function W(e, t) {
	let n = e.slice(0, un(e, t) + 1), r = n.findLastIndex((e) => e.type === "section-heading");
	return r < 0 ? [] : n.slice(r);
}
function un(e, t) {
	return e.findIndex((e) => dn(e, t));
}
function dn(e, t) {
	return e.id === t || e.children.some((e) => dn(e, t));
}
//#endregion
//#region src/menu/menu-entries.ts
var G = "Text", K = "Plan", fn = { cells: [
	"",
	"",
	""
] }, pn = [
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
			rows: [fn, fn]
		}
	},
	{
		kind: "kpi",
		title: "KPI",
		group: K,
		aliases: ["metric", "success"],
		props: () => ({ kpiId: f("kpi") })
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
		props: () => ({ questionId: f("q") })
	},
	{
		kind: "answer",
		title: "Answer",
		group: K,
		props: (e) => {
			let t = ln(e.blocks, e.cursorId);
			return t ? { questionId: t } : null;
		}
	}
];
//#endregion
//#region src/menu/menu-items.ts
function mn(e, t) {
	return pn.filter((t) => e.allows.includes(t.kind)).flatMap((e) => hn(e, t));
}
function hn(e, t) {
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
function gn() {
	let e = m(H), t = o(F);
	return /* @__PURE__ */ h(he, {
		triggerCharacter: "/",
		getItems: async (n) => xe(_n(e, t), n)
	});
}
function _n(e, t) {
	let n = e.document, { block: r } = e.getTextCursorPosition(), i = U(n, r.id), a = t?.slots.find((e) => e.slot === i);
	return a ? mn(a, {
		blocks: n,
		cursorId: r.id
	}).map(({ block: t, ...n }) => ({
		...n,
		aliases: [...n.aliases],
		onItemClick: () => Se(e, Ue(t))
	})) : [];
}
//#endregion
//#region src/outline/problems-by-slot.ts
function vn(e) {
	return e.reduce((e, t) => e.set(t.slot, [...e.get(t.slot) ?? [], t]), /* @__PURE__ */ new Map());
}
var q = {
	outline: "_outline_cz554_1",
	phase: "_phase_cz554_8",
	slots: "_slots_cz554_15",
	title: "_title_cz554_22",
	required: "_required_cz554_26",
	problems: "_problems_cz554_30"
};
//#endregion
//#region src/outline/TemplateOutline.tsx
function yn({ template: e, report: t }) {
	let n = vn(t.problems);
	return /* @__PURE__ */ g("nav", {
		className: q.outline,
		"aria-label": "Plan outline",
		children: [/* @__PURE__ */ g("p", {
			className: q.phase,
			children: [
				t.passed ? "Ready for" : "Not ready for",
				" ",
				t.phase
			]
		}), /* @__PURE__ */ h("ol", {
			className: q.slots,
			children: e.slots.map((e) => /* @__PURE__ */ h(bn, {
				slot: e,
				phase: t.phase,
				problems: n.get(e.slot) ?? []
			}, e.slot))
		})]
	});
}
function bn({ slot: e, phase: t, problems: n }) {
	return /* @__PURE__ */ g("li", {
		"aria-label": e.title,
		children: [
			/* @__PURE__ */ h("span", {
				className: q.title,
				children: e.title
			}),
			ie(e.required, t) && /* @__PURE__ */ h("span", {
				className: q.required,
				children: " required"
			}),
			/* @__PURE__ */ h("ul", {
				className: q.problems,
				children: n.map((e) => /* @__PURE__ */ h("li", { children: e.message }, `${e.code}-${e.message}`))
			})
		]
	});
}
var J = {
	editor: "_editor_o6zst_1",
	withOutline: "_withOutline_o6zst_9",
	single: "_single_o6zst_13"
}, Y = {
	bar: "_bar_xsz4f_1",
	user: "_user_xsz4f_14",
	dot: "_dot_xsz4f_20"
};
//#endregion
//#region src/presence/presence-users.ts
function xn(e, t) {
	return [...e].flatMap(([e, { user: n, editing: r }]) => e === t || !n ? [] : [Sn(e, n, r)]);
}
function Sn(e, t, n) {
	return {
		clientId: e,
		name: String(t.name ?? "Someone"),
		color: String(t.color ?? "gray"),
		slot: Cn(n)
	};
}
function Cn(e) {
	let t = e?.slot;
	return typeof t == "string" ? t : null;
}
//#endregion
//#region src/presence/use-presence.ts
function wn(e) {
	let [t, n] = u(() => En(e));
	return s(() => {
		let t = () => n(En(e));
		return e.on("change", t), t(), () => e.off("change", t);
	}, [e]), t;
}
function Tn(e, t) {
	s(() => e.onSelectionChange(() => {
		let { block: n } = e.getTextCursorPosition(), r = e.document;
		t.setLocalStateField("editing", { slot: U(r, n.id) });
	}), [e, t]);
}
function En(e) {
	return xn(e.getStates(), e.clientID);
}
//#endregion
//#region src/presence/PresenceBar.tsx
function Dn({ awareness: e, template: t }) {
	let n = wn(e);
	return /* @__PURE__ */ h("ul", {
		className: Y.bar,
		"aria-label": "Also editing",
		children: n.map((e) => /* @__PURE__ */ g("li", {
			className: Y.user,
			children: [/* @__PURE__ */ h("svg", {
				className: Y.dot,
				viewBox: "0 0 2 2",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h("circle", {
					cx: "1",
					cy: "1",
					r: "1",
					fill: e.color
				})
			}), On(e, t)]
		}, e.clientId))
	});
}
function On(e, t) {
	let n = t.slots.find((t) => t.slot === e.slot);
	return n ? `${e.name} in ${n.title}` : e.name;
}
var kn = { notice: "_notice_1xdcv_1" }, An = {
	connecting: "Connecting to the plan…",
	ready: "Connected.",
	disconnected: "Offline. Keep writing; your changes sync when the connection returns.",
	denied: "You do not have access to this plan."
};
function X({ status: e, reason: t }) {
	return /* @__PURE__ */ g("p", {
		className: kn.notice,
		role: "status",
		"data-status": e,
		children: [An[e], t && ` ${t}`]
	});
}
//#endregion
//#region src/session/plan-session.ts
var Z = "plan-transport";
function jn(e) {
	let t = new Ae(), n = {
		doc: t,
		awareness: new b(t)
	}, r = Nn({
		status: "connecting",
		meta: null
	});
	In(n, e);
	let i = e.subscribe((e) => Fn({
		...n,
		store: r
	}, e));
	return {
		...n,
		state: r.get,
		onState: r.listen,
		destroy: () => Mn(n, i)
	};
}
function Mn({ doc: e, awareness: t }, n) {
	t.setLocalState(null), n(), t.destroy(), e.destroy();
}
function Nn(e) {
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
var Pn = {
	document: ({ doc: e, store: t }, { state: n, meta: r }) => {
		S(e, _(n), Z), t.set({
			status: "ready",
			meta: r
		});
	},
	update: ({ doc: e }, { update: t }) => S(e, _(t), Z),
	awareness: ({ awareness: e }, { update: t }) => ke(e, _(t), Z),
	meta: ({ store: e }, { meta: t }) => e.set({ meta: t }),
	status: ({ store: e }, { status: t, reason: n }) => e.set({
		status: t,
		reason: n
	})
};
function Fn(e, t) {
	Pn[t.type](e, t);
}
function In({ doc: t, awareness: n }, r) {
	t.on("update", (e, t) => {
		t !== "plan-transport" && r.send({
			type: "update",
			update: y(e)
		});
	}), n.on("update", (t, i) => {
		if (i === "plan-transport") return;
		let a = x(n, e(t));
		r.send({
			type: "awareness",
			update: y(a)
		});
	});
}
//#endregion
//#region src/session/use-plan-session.ts
function Ln(e) {
	let [t, n] = u(null);
	return s(() => {
		let t = jn(e);
		return n(t), () => t.destroy();
	}, [e]), t;
}
function Rn(e) {
	return ee(e.onState, e.state);
}
//#endregion
//#region src/template/template-guard.ts
var zn = "planTemplateBypass", Q = "section-heading", Bn = "blockContent", Vn = [
	"plan-title",
	Q,
	"section-panel",
	"section-actions"
], Hn = be({
	key: "planTemplateGuard",
	prosemirrorPlugins: [new Ne({ filterTransaction: Wn })]
});
function Un(e, t) {
	return e.setMeta(zn, t);
}
function Wn(e, t) {
	if (!e.docChanged || Gn(e)) return !0;
	let n = Kn(t.doc), r = Kn(e.doc);
	return Zn(Jn(n), Jn(r)) && Yn(n, r);
}
function Gn(e) {
	let t = e.getMeta(Pe);
	return !!e.getMeta(zn) || t?.isChangeOrigin === !0;
}
function Kn(e) {
	let t = [];
	return e.descendants((e) => {
		qn(e) && t.push({
			type: e.type.name,
			slot: String(e.attrs.slot)
		});
	}), t;
}
function qn(e) {
	let { spec: t } = e.type;
	return (t.group ?? "").split(" ").includes(Bn);
}
function Jn(e) {
	return e.filter((e) => Vn.includes(e.type)).map((e) => `${e.type}:${e.slot}`);
}
function Yn(e, t) {
	return Xn(t) === 0 || Xn(e) > 0;
}
function Xn(e) {
	let t = e.findIndex((e) => e.type === Q);
	return (t < 0 ? e : e.slice(0, t)).filter((e) => e.type !== "plan-title").length;
}
function Zn(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
//#endregion
//#region src/use-plan-editor.ts
function Qn({ session: e, meta: t, user: n, onChange: r }) {
	let i = $n(e, n), o = er(i, e, a((e) => r?.(T(e, t)), [t, r]));
	return {
		editor: i,
		plan: l(() => T(o, t), [o, t])
	};
}
function $n(e, t) {
	let { doc: n } = e;
	return ge(Me({
		schema: H,
		extensions: [Hn],
		collaboration: {
			fragment: n.getXmlFragment(ne),
			user: { ...t },
			provider: e
		}
	}), [e]);
}
function er(e, t, n) {
	let [r, i] = u(() => v(t.doc));
	return s(() => e.onChange((e) => {
		i(e.document), n(e.document);
	}), [e, n]), r;
}
//#endregion
//#region src/PlanEditor.tsx
var tr = {};
function nr({ transport: e, adapters: t = tr, className: n, ...r }) {
	let i = Ln(e);
	return /* @__PURE__ */ h(C, {
		value: t,
		children: /* @__PURE__ */ h("div", {
			className: rr({
				...r,
				className: n
			}),
			children: i ? /* @__PURE__ */ h(ir, {
				...r,
				session: i
			}) : /* @__PURE__ */ h(X, { status: "connecting" })
		})
	});
}
function rr({ showOutline: e, className: t }) {
	let n = e === !1 ? J.single : J.withOutline;
	return [
		J.editor,
		n,
		"ps-editor",
		t
	].filter(Boolean).join(" ");
}
function ir({ template: e, ...t }) {
	let { status: n, meta: r, reason: i } = Rn(t.session);
	if (!r) return /* @__PURE__ */ h(X, {
		status: n,
		reason: i
	});
	let a = e ?? le(r.type);
	return /* @__PURE__ */ g(F, {
		value: a,
		children: [n !== "ready" && /* @__PURE__ */ h(X, {
			status: n,
			reason: i
		}), /* @__PURE__ */ h(ar, {
			...t,
			meta: r,
			template: a
		})]
	});
}
function ar({ validationPhase: e = "approval", onValidation: t, onRefine: n, ...r }) {
	let { session: i, user: a } = r, { editor: o, plan: s } = Qn(r), c = cr(s, e, t), { awareness: l } = i;
	Tn(o, l);
	let u = {
		...r,
		editor: o,
		awareness: l,
		report: c
	};
	return /* @__PURE__ */ h(Fe, {
		value: {
			user: a,
			onRefine: n,
			doc: i.doc
		},
		children: /* @__PURE__ */ h(or, { ...u })
	});
}
function or({ showOutline: e = !0, showPresence: t = !0, ...n }) {
	let { template: r } = n;
	return /* @__PURE__ */ g(ve, { children: [
		t && /* @__PURE__ */ h(Dn, {
			awareness: n.awareness,
			template: r
		}),
		/* @__PURE__ */ h(sr, { ...n }),
		e && /* @__PURE__ */ h(yn, {
			template: r,
			report: n.report
		})
	] });
}
function sr({ editor: e, readOnly: t }) {
	return /* @__PURE__ */ g(te, {
		editor: e,
		editable: !t,
		slashMenu: !1,
		sideMenu: !1,
		children: [/* @__PURE__ */ h(gn, {}), /* @__PURE__ */ h(Le, {})]
	});
}
function cr(e, t, n) {
	let r = l(() => fe(e, t), [e, t]);
	return s(() => n?.(r), [r, n]), r;
}
//#endregion
//#region src/session/memory-hub.ts
function lr(e) {
	let t = De(e.blocks), n = new b(t);
	n.setLocalState(null);
	let r = {
		doc: t,
		awareness: n,
		meta: e.meta,
		peers: /* @__PURE__ */ new Set()
	};
	return dr(r), {
		doc: t,
		connect: () => pr(r)
	};
}
function ur(e) {
	return lr(e).connect();
}
function dr(t) {
	let { doc: n, awareness: r } = t;
	n.on("update", (e, n) => fr(t, n, {
		type: "update",
		update: y(e)
	})), r.on("update", (n, i) => {
		let a = x(r, e(n));
		fr(t, i, {
			type: "awareness",
			update: y(a)
		});
	});
}
function fr(e, t, n) {
	[...e.peers].filter((e) => e !== t).forEach((e) => e.handlers.forEach((e) => e(n)));
}
function pr(e) {
	let t = { handlers: /* @__PURE__ */ new Set() };
	return e.peers.add(t), {
		send: (n) => mr(e, t, n),
		subscribe: (n) => (t.handlers.add(n), hr(e, n), () => t.handlers.delete(n))
	};
}
function mr(e, t, n) {
	if (n.type === "update") {
		S(e.doc, _(n.update), t);
		return;
	}
	ke(e.awareness, _(n.update), t);
}
function hr({ doc: e, awareness: t, meta: n }, r) {
	r({
		type: "document",
		meta: n,
		state: y(je(e))
	});
	let i = [...t.getStates().keys()];
	if (i.length > 0) {
		let e = x(t, i);
		r({
			type: "awareness",
			update: y(e)
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
}, gr = {
	kept: " ",
	added: "+",
	removed: "-"
};
function _r({ before: e, after: t, className: n }) {
	let r = re(e, t), i = r.sections.length === 0 && r.meta.length === 0;
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
			/* @__PURE__ */ h(vr, { changes: r.meta }),
			r.sections.map((e) => /* @__PURE__ */ h(yr, { section: e }, e.slot)),
			/* @__PURE__ */ h(br, {
				what: "Success criteria",
				changes: r.kpis
			})
		]
	});
}
function vr({ changes: e }) {
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
function yr({ section: e }) {
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
					children: [gr[e.kind], " "]
				}), e.text]
			}, `${e.kind}-${t}`))
		})]
	});
}
function br({ what: e, changes: t }) {
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
export { _r as PlanDiffView, nr as PlanEditor, Un as bypassTemplate, lr as createMemoryHub, We as fromEditorBlocks, ur as localTransport, H as planSchema, T as projectBlocks, t as transportFor };

//# sourceMappingURL=index.js.map