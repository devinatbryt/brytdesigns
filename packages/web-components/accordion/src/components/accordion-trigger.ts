import { type CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createEffect, onCleanup } from "solid-js";

import { useAccordionItem } from "../hooks/index.js";

type Props = {
  preventDefault: boolean;
};

export const Name = `accordion-trigger`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
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
