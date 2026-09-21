import { offset, type ReferenceElement } from "@floating-ui/react";
import { SideMenuController, type FloatingUIOptions } from "@blocknote/react";

// BlockNote pins the menu to a block's top edge; plan blocks open with rules and spacing.
const OPTIONS: Partial<FloatingUIOptions> = {
  useFloatingOptions: {
    placement: "left-start",
    middleware: [
      offset(({ elements, rects }) => {
        const centre = lineCentreOf(elements.reference);

        return { crossAxis: centre ? centre - rects.floating.height / 2 : 0 };
      }),
    ],
  },
};

export function PlanSideMenu() {
  return <SideMenuController floatingUIOptions={OPTIONS} />;
}

function lineCentreOf(reference: ReferenceElement): number | null {
  const block =
    reference instanceof Element ? reference : reference.contextElement;

  return block ? firstLineCentre(block) : null;
}

/** How far below the block's top edge its first line of text is centred. */
export function firstLineCentre(block: Element): number | null {
  const line = firstLineRect(block);

  return line && line.top + line.height / 2 - block.getBoundingClientRect().top;
}

function firstLineRect(block: Element): DOMRect | null {
  const text = firstText(block);

  if (text) {
    const range = document.createRange();
    range.selectNodeContents(text);

    return range.getClientRects()[0] ?? null;
  }

  const empty = block.querySelector(".bn-inline-content");

  return empty && lineBox(empty);
}

function firstText(block: Element): Text | null {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });

  return walker.nextNode() as Text | null;
}

/** An empty line has no text to measure, so its height is its line height. */
function lineBox(element: Element): DOMRect {
  const { top, left, width } = element.getBoundingClientRect();
  const height = parseFloat(getComputedStyle(element).lineHeight);

  return new DOMRect(left, top, width, height);
}
