import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useModal } from "../hooks/index.js";
import { controlPromise, getTransitionConfig } from "../utils.js";

type Props = {};

export const Name = "drawer-backdrop";

export const Component: CorrectComponentType<Props> = (_, { element }) => {
  const [state, { updateAnimationQueue, close }] = useModal(element);

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
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--modal--opacity-from)`, `var(--modal--opacity-to)`],
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
        opacity: [`var(--modal--opacity-to)`, `var(--modal--opacity-from)`],
      },
      options,
    );
  }

  element.addEventListener("click", close);

  onCleanup(() => {
    element.removeEventListener("click", close);
  });
};
