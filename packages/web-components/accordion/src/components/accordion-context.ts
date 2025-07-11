import {
  toHyphenated,
  type CorrectComponentType,
} from "@brytdesigns/web-component-core/utils";

import {
  provideAccordionContext,
  useAccordionContext,
} from "../hooks/index.js";

type Props = {
  activeIndex: number;
  isAnimating: boolean;
};

export const Name = `accordion-context`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  const context = provideAccordionContext(props, element);
  const [_, methods] = useAccordionContext(context);
  const children = Array.from(element.children) as HTMLElement[];
  const accordionItems = children.filter(
    (child) => child.tagName === "ACCORDION-ITEM",
  );
  accordionItems.forEach((accordionItem, index) => {
    accordionItem.setAttribute("index", `${index + 1}`);
    if (accordionItem.getAttribute(toHyphenated("isExpanded")) !== "true")
      return;
    methods.item.update(index + 1);
  });
};
