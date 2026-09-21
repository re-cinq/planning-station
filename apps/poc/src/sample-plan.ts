import {
  titleBlock,
  type BlockJson,
  type PlanMeta,
} from "@re-cinq/planning-document";
import {
  planMeta,
  planWith,
  textBlock,
  type SectionContent,
} from "@re-cinq/planning-document/testing";

export const SAMPLE_TITLE = "Faster checkout on mobile";

export const SAMPLE_META: PlanMeta = planMeta("feature", SAMPLE_TITLE);

interface Question {
  id: string;
  why: string;
  options?: string;
  text: string;
}

interface Comment {
  id: string;
  author: string;
  at: string;
  text: string;
  replyTo?: string;
  resolved?: boolean;
}

const said = ({ id, text, ...props }: Comment) =>
  textBlock("comment", { commentId: id, ...props }, text);
const asked = ({ id, why, options = "", text }: Question) =>
  textBlock(
    "question",
    { questionId: id, why, kind: options ? "choice" : "text", options },
    text,
  );
const paragraph = (text: string) => textBlock("paragraph", {}, text);
const bullet = (text: string) => textBlock("bulletListItem", {}, text);
const step = (text: string) => textBlock("numberedListItem", {}, text);

const CONTENT: SectionContent = {
  intent: [
    paragraph(
      "Four in ten mobile shoppers who reach checkout leave before paying. Session recordings show the same moment again and again: the price step spins for two to four seconds while shipping and tax are recalculated, and people give up.",
    ),
    paragraph(
      "We want the price step to feel instant on a phone, so a shopper who has decided to buy is never made to wait for us to agree. This keeps sales we have already won; it is not about winning new ones.",
    ),
    asked({
      id: "q-audience",
      why: "it decides whether desktop is in scope",
      options:
        "Mobile only, Mobile and desktop, Every channel including the app",
      text: "Which shoppers is this for?",
    }),
    said({
      id: "c-ben",
      author: "Ben",
      at: "2026-09-18T09:12:00.000Z",
      text: "Support tags this complaint every week. Happy to share the ticket export.",
    }),
    said({
      id: "c-ana-export",
      replyTo: "c-ben",
      author: "Ana",
      at: "2026-09-18T10:02:00.000Z",
      text: "Yes please, the last three months would settle the desktop question.",
    }),
  ],
  kpis: [
    textBlock(
      "kpi",
      {
        kpiId: "k-latency",
        metric: "Price step p95 on mobile",
        baseline: "3.2 s",
        target: "400 ms",
        direction: "down",
        deadline: "2026-12-15",
      },
      "Above one second, abandonment on this step doubles.",
    ),
    textBlock(
      "kpi",
      {
        kpiId: "k-completion",
        metric: "Mobile checkout completion",
        baseline: "58 %",
        target: "66 %",
        direction: "up",
        deadline: "2027-01-31",
      },
      "Eight points is the revenue case the leadership team signed off.",
    ),
    textBlock(
      "kpi",
      {
        kpiId: "k-mismatch",
        metric: "Price mismatches at payment",
        baseline: "0.3 %",
        target: "0.3 %",
        direction: "hold",
        deadline: "",
      },
      "Faster must not mean wrong: a shown price may never differ from the charge.",
    ),
    asked({
      id: "q-target",
      why: "the target is where the work stops",
      options: "400 ms, 300 ms, 200 ms",
      text: "Is 400 ms the number we stop at?",
    }),
  ],
  scope: [
    paragraph("In scope:"),
    bullet("Shipping and tax quotes on the price step, for guests and members"),
    bullet(
      "Caching a quote per basket, so a returning shopper sees it at once",
    ),
    bullet("A placeholder price that renders immediately and fills in"),
    paragraph("Out of scope:"),
    bullet("The payment provider's own page, which we do not control"),
    bullet("Vouchers and promotions, which keep calculating as they do today"),
    asked({
      id: "q-tax-markets",
      why: "a cached tax quote could go stale at midnight",
      text: "Which markets change their tax rules during the day?",
    }),
  ],
  prototype: [
    textBlock(
      "prototype",
      {
        maturity: "click-dummy",
        url: "https://www.figma.com/proto/checkout-price-step",
        agreedBy: "Ana",
      },
      "Tap through the price step: the placeholder price fills in after 300 ms.",
    ),
    said({
      id: "c-cleo",
      author: "Cleo",
      at: "2026-09-18T14:40:00.000Z",
      text: "Can we put the placeholder in front of five shoppers before we build it?",
      resolved: true,
    }),
    said({
      id: "c-ben-sessions",
      replyTo: "c-cleo",
      author: "Ben",
      at: "2026-09-19T08:15:00.000Z",
      text: "Booked five sessions for Thursday.",
    }),
  ],
  constraints: [
    bullet(
      "The tax service allows 50 requests a second; a cache must not add load",
    ),
    bullet(
      "Shown price equals charged price, and finance signs off on any cache",
    ),
    bullet("No new infrastructure this quarter: use the Redis cluster we run"),
  ],
  ownership: [
    paragraph(
      "Team Checkout owns the price step and answers the pager for it. The tax integration stays with Team Payments, who review any change to how we call them.",
    ),
  ],
  delivery: [
    step("Ship behind a flag to 5 % of mobile traffic for one week"),
    step("Compare completion and mismatches against the control group"),
    step("Roll out to all mobile traffic, then decide on desktop"),
    asked({
      id: "q-announce",
      why: "support takes the first complaints",
      options: "Team Checkout, The support lead, Nobody, it is invisible",
      text: "Who tells support before the rollout?",
    }),
    asked({
      id: "q-rollback",
      why: "someone has to own the flag when mismatches rise",
      text: "Who decides to roll back, and at what mismatch rate?",
    }),
  ],
  questions: [
    asked({
      id: "q-staleness",
      why: "a stale quote is a wrong price",
      options: "Never, Up to 5 minutes, Up to an hour",
      text: "How old may a cached shipping quote be?",
    }),
    asked({
      id: "q-tax-down",
      why: "a cache miss must never block paying",
      text: "What does a shopper see when the tax service is down?",
    }),
    asked({
      id: "q-carriers",
      why: "some carriers forbid caching in their terms",
      options: "All carriers, Only our own fleet, None until legal checks",
      text: "Whose shipping quotes may we cache?",
    }),
  ],
};

const [, ...SECTIONS] = planWith("feature", CONTENT);

export const SAMPLE_BLOCKS: BlockJson[] = [
  titleBlock(SAMPLE_TITLE),
  ...SECTIONS,
];
