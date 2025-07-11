import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";

import {
  AccordionContext,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "./components/index.js";

customShadowlessElement(
  AccordionContext.Name,
  { activeIndex: -1, isAnimating: false },
  correctElementType(AccordionContext.Component),
);

customShadowlessElement(
  AccordionItem.Name,
  { index: 0, isExpanded: false, ariaExpanded: false },
  correctElementType(AccordionItem.Component),
);

customShadowlessElement(
  AccordionTrigger.Name,
  { preventDefault: true },
  correctElementType(AccordionTrigger.Component),
);

customShadowlessElement(
  AccordionContent.Name,
  { shouldScrollIntoView: false },
  correctElementType(AccordionContent.Component),
);

export * from "./hooks/index.js";
