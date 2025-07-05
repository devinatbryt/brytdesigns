import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useModal } from "../hooks/index.js";
import { getTransitionConfig } from "../utils.js";

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
        updateAnimationQueue(animation);
        return onCleanup(() => {
          if (animation.state !== "finished") animation.complete();
        });
      },
    ),
  );

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (isOpen) return;
        const animation = exit(element);
        updateAnimationQueue(animation);
        return onCleanup(() => {
          if (animation.state !== "finished") animation.complete();
        });
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
          `translateX(var(--${Name}--slide-x-from)) translateY(var(--${Name}--slide-y-from)) scaleX(var(--${Name}--scale-x-from)) scaleY(var(--${Name}--scale-y-from))`,
          `translateX(var(--${Name}--slide-x-to)) translateY(var(--${Name}--slide-y-to)) scaleX(var(--${Name}--scale-x-to)) scaleY(var(--${Name}--scale-y-to))`,
        ],
        opacity: [`var(--${Name}--opacity-from)`, `var(--${Name}--opacity-to)`],
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
          `translateX(var(--${Name}--slide-x-to)) translateY(var(--${Name}--slide-y-to)) scaleX(var(--${Name}--scale-x-to)) scaleY(var(--${Name}--scale-y-to))`,
          `translateX(var(--${Name}--slide-x-from)) translateY(var(--${Name}--slide-y-from)) scaleX(var(--${Name}--scale-x-from)) scaleY(var(--${Name}--scale-y-from))`,
        ],
        opacity: [`var(--${Name}--opacity-to)`, `var(--${Name}--opacity-from)`],
      },
      transition,
    );
  }
};
