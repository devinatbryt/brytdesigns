import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

import {
  AccordionContext,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "./components/index.js";

customShadowlessElement(
  "accordion-context",
  { activeIndex: -1, isAnimating: false },
  correctElementType(AccordionContext),
);

customShadowlessElement(
  "accordion-item",
  { index: 0, isExpanded: false, ariaExpanded: false },
  correctElementType(AccordionItem),
);

customShadowlessElement(
  "accordion-trigger",
  { preventDefault: true },
  correctElementType(AccordionTrigger),
);

customShadowlessElement(
  "accordion-content",
  { shouldScrollIntoView: false },
  correctElementType(AccordionContent),
);

export * from "./hooks/index.js";
