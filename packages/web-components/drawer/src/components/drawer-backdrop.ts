import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useDrawer } from "../hooks/index.js";
import { controlPromise, getTransitionConfig } from "../utils.js";

type DrawerBackdropProps = {};

export const DrawerBackdrop: CorrectComponentType<DrawerBackdropProps> = (
  _,
  { element }
) => {
  const [state, { updateAnimationQueue, close }] = useDrawer(element);

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (!isOpen) return;
        const animation = enter(element);
        updateAnimationQueue(controlPromise(animation));
        return onCleanup(animation.complete);
      }
    )
  );

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (isOpen) return;
        const animation = exit(element);
        updateAnimationQueue(controlPromise(animation));
        return onCleanup(animation.complete);
      }
    )
  );

  function enter(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--opacity-from)`, `var(--opacity-to)`],
      },
      options
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--opacity-to)`, `var(--opacity-from)`],
      },
      options
    );
  }

  element.addEventListener("click", close);

  onCleanup(() => {
    element.removeEventListener("click", close);
  });
};
