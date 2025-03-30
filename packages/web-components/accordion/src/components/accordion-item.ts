import { type CorrectComponentType } from "@brytdesigns/web-component-utils";

import { provideAccordionItemContext } from "../hooks/index.js";

type AccordionItemProps = {
  index: number;
  isExpanded: boolean;
  ariaExpanded: boolean;
};

export const AccordionItem: CorrectComponentType<AccordionItemProps> = (
  props,
  { element },
) => {
  if (element.parentElement?.tagName !== "ACCORDION-CONTEXT")
    return console.warn(
      "accordion-item must be an immediate child of accordion-context",
      element,
    );

  provideAccordionItemContext(props, element);
};
