import { type CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, onCleanup } from "solid-js";

import { useAccordionItem } from "../hooks/index.js";

type AccordionTriggerProps = {
  preventDefault: boolean;
};

export const AccordionTrigger: CorrectComponentType<AccordionTriggerProps> = (
  props,
  { element },
) => {
  const [state, methods] = useAccordionItem(element);

  createEffect(() => {
    const isAnimating = state.isAnimating;
    if (isAnimating) return;

    const controller = new AbortController(),
      preventDefault = props.preventDefault;

    element.addEventListener(
      "click",
      (event) => {
        if (preventDefault) event.preventDefault();
        methods.toggle();
      },
      { signal: controller.signal },
    );

    return onCleanup(() => {
      controller.abort();
    });
  });
};
