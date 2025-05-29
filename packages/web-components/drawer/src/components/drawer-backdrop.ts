import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, onMount, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useDrawer } from "../hooks/index.js";
import { controlPromise, getTransitionConfig } from "../utils.js";

type DrawerBackdropProps = {};

export const Name = `drawer-backdrop`;

export const Component: CorrectComponentType<DrawerBackdropProps> = (
  _,
  { element },
) => {
  const [state, { updateAnimationQueue, close }] = useDrawer(element);
  const controller = new AbortController();

  let isFirstRender = true;

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (!isOpen || isFirstRender) return;
        const animation = enter(element);
        updateAnimationQueue(controlPromise(animation));
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
        if (isOpen || isFirstRender) return;
        const animation = exit(element);
        updateAnimationQueue(controlPromise(animation));
        return onCleanup(() => {
          if (animation.state !== "finished") animation.complete();
        });
      },
    ),
  );

  onMount(() => {
    isFirstRender = false;
  });

  function enter(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const options = getTransitionConfig(style);
    return animate(
      element,
      {
        opacity: [`var(--drawer--opacity-from)`, `var(--drawer--opacity-to)`],
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
        opacity: [`var(--drawer--opacity-to)`, `var(--drawer--opacity-from)`],
      },
      options,
    );
  }

  element.addEventListener("click", () => close(), {
    signal: controller.signal,
  });

  onCleanup(() => {
    controller.abort();
  });

  isFirstRender = false;
};
