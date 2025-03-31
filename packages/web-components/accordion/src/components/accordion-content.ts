import { type CorrectComponentType } from "@brytdesigns/web-component-utils";
import type { ICustomElement } from "component-register";
import { animate, type AnimationPlaybackControls } from "motion";
import { createEffect, on, onCleanup } from "solid-js";

import { useAccordion, useAccordionItem } from "../hooks/index.js";

type AccordionContentProps = {
  shouldScrollIntoView: boolean;
};

async function controlPromise(controls: AnimationPlaybackControls) {
  return new Promise((resolve) => {
    controls.then(() => resolve(null));
  });
}

const hideElement = (element: ICustomElement) => {
  element.style.cssText = `
      display: none;
      opacity: 0;
      visibility: hidden;
      max-height: 0px;
    `;
  element.style.overflow = null;
};

const showElement = (element: ICustomElement) => {
  element.style.cssText = `
      display: block;
      opacity: 1;
      visibility: visible;
    `;
};

const getHeight = (el: ICustomElement & HTMLElement) => {
  el.style.maxHeight = "max-content";
  const height = el.getBoundingClientRect().height;
  el.style.maxHeight = `${0}`;
  return height;
};

const getPaddingTop = (element: ICustomElement & HTMLElement) => {
  const paddingY = parseInt(getComputedStyle(element).paddingTop);
  return paddingY;
};

const getPaddingBottom = (element: ICustomElement & HTMLElement) => {
  const paddingY = parseInt(getComputedStyle(element).paddingBottom);
  return paddingY;
};

export const AccordionContent: CorrectComponentType<AccordionContentProps> = (
  props,
  { element },
) => {
  const [state] = useAccordionItem(element);
  const [_, accordionMethods] = useAccordion(element);

  let isFirstRender = true;

  const expand = (element: ICustomElement & HTMLElement) => {
    showElement(element);

    const height = getHeight(element),
      pt = getPaddingTop(element),
      pb = getPaddingBottom(element);

    (Array.from(element.children) as HTMLElement[]).forEach(
      (child) => (child.style.opacity = "1"),
    );

    const animation = animate(
      element,
      {
        maxHeight: ["0px", `${height}px`],
        paddingTop: ["0px", `${pt}px`],
        paddingBottom: ["0px", `${pb}px`],
      },
      {
        duration: 0.35,
      },
    );

    animation.then(() => {
      element.style.maxHeight = "max-content";
      //@ts-ignore
      element.style.overflow = null;
      if (props.shouldScrollIntoView)
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      return;
    });

    return animation;
  };

  const collapse = (element: ICustomElement & HTMLElement) => {
    const height = getHeight(element),
      pt = getPaddingTop(element),
      pb = getPaddingBottom(element);

    element.style.overflow = "hidden";

    (Array.from(element.children) as HTMLElement[]).forEach(
      (child) => (child.style.opacity = "0"),
    );

    const animation = animate(
      element,
      {
        maxHeight: [`${height}px`, "0px"],
        paddingTop: [`${pt}px`, "0px"],
        paddingBottom: [`${pb}px`, "0px"],
      },
      {
        duration: 0.35,
      },
    );

    animation.then(() => hideElement(element));

    return animation;
  };

  createEffect(
    on(
      () => state.isExpanded,
      (isExpanded) => {
        if (!isExpanded) {
          const animation = collapse(element);
          accordionMethods.updateAnimationQueue(controlPromise(animation));
          return onCleanup(() => animation.complete());
        }

        if (isFirstRender) {
          isFirstRender = false;
          showElement(element);
        }

        const animation = expand(element);
        accordionMethods.updateAnimationQueue(controlPromise(animation));
        return onCleanup(() => animation.complete());
      },
    ),
  );
};
