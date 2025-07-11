import { type CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { provideAccordionItemContext } from "../hooks/index.js";

type Props = {
  index: number;
  isExpanded: boolean;
  ariaExpanded: boolean;
};

export const Name = `accordion-item`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (element.parentElement?.tagName !== "ACCORDION-CONTEXT")
    return console.warn(
      `${Name}: must be an immediate child of accordion-context`,
      element,
    );

  provideAccordionItemContext(props, element);
};
