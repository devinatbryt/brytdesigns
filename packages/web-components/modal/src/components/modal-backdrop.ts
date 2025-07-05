import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useModal } from "../hooks/index.js";
import { getTransitionConfig } from "../utils.js";

type Props = {};

export const Name = "modal-backdrop";

export const Component: CorrectComponentType<Props> = (_, { element }) => {
  const [state, { updateAnimationQueue, close }] = useModal(element);

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
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--${Name}--opacity-from)`, `var(--${Name}--opacity-to)`],
      },
      options,
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--${Name}--opacity-to)`, `var(--${Name}--opacity-from)`],
      },
      options,
    );
  }

  element.addEventListener("click", close);

  onCleanup(() => {
    element.removeEventListener("click", close);
  });
};
