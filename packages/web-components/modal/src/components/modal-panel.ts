import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useModal } from "../hooks/index.js";
import { controlPromise, getTransitionConfig } from "../utils.js";

type Props = {};

export const Name = "modal-panel";

export const Component: CorrectComponentType<Props> = (_, { element }) => {
  const [state, { updateAnimationQueue }] = useModal(element);

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (!isOpen) return;
        const animation = enter(element);
        updateAnimationQueue(controlPromise(animation));
        return onCleanup(animation.complete);
      },
    ),
  );

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (isOpen) return;
        const animation = exit(element);
        updateAnimationQueue(controlPromise(animation));
        return onCleanup(animation.complete);
      },
    ),
  );

  function enter(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const transition = getTransitionConfig(style);

    return animate(
      element,
      {
        transform: [
          `translateX(var(--${Name}--slide-x-from,0%)) translateY(var(--${Name}--slide-y-from,0%)) scaleX(var(--${Name}--scale-x-from,1)) scaleY(var(--${Name}--scale-y-from,1))`,
          `translateX(var(--${Name}--slide-x-to,0%)) translateY(var(--${Name}--slide-y-to,0%)) scaleX(var(--${Name}--scale-x-to,1)) scaleY(var(--${Name}--scale-y-to,1))`,
        ],
        opacity: [
          `var(--${Name}--opacity-from,0)`,
          `var(--${Name}--opacity-to,1)`,
        ],
      },
      transition,
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const transition = getTransitionConfig(style);
    return animate(
      element,
      {
        transform: [
          `translateX(var(--${Name}--slide-x-to,0%)) translateY(var(--${Name}--slide-y-to,0%)) scaleX(var(--${Name}--scale-x-to,1)) scaleY(var(--${Name}--scale-y-to,1))`,
          `translateX(var(--${Name}--slide-x-from,0%)) translateY(var(--${Name}--slide-y-from,0%)) scaleX(var(--${Name}--scale-x-from,1)) scaleY(var(--${Name}--scale-y-from,1))`,
        ],
        opacity: [
          `var(--${Name}--opacity-to,1)`,
          `var(--${Name}--opacity-from,0)`,
        ],
      },
      transition,
    );
  }
};
