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
        x: [`var(--${Name}--slide-x-from)`, `var(--${Name}--slide-x-to)`],
        y: [`var(--${Name}--slide-y-from)`, `var(--${Name}--slide-y-to)`],
        scaleY: [`var(--${Name}--scale-y-from)`, `var(--${Name}--scale-y-to)`],
        scaleX: [`var(--${Name}--scale-x-from)`, `var(--${Name}--scale-x-to)`],
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
        x: [`var(--${Name}--slide-x-to)`, `var(--${Name}--slide-x-from)`],
        y: [`var(--${Name}--slide-y-to)`, `var(--${Name}--slide-y-from)`],
        scaleY: [`var(--${Name}--scale-y-to)`, `var(--${Name}--scale-y-from)`],
        scaleX: [`var(--${Name}--scale-x-to)`, `var(--${Name}--scale-x-from)`],
        opacity: [`var(--${Name}--opacity-to)`, `var(--${Name}--opacity-from)`],
      },
      transition,
    );
  }
};
