import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, onMount, on, onCleanup } from "solid-js";
import { animate } from "motion";
import { getTransitionConfig } from "@brytdesigns/web-component-core/animation";

import { useModal } from "../hooks/index.js";

type Props = {};

export const Name = "modal-backdrop";

export const Component: CorrectComponentType<Props> = (_, { element }) => {
  const [state, { updateAnimationQueue, close }] = useModal(element);
  const controller = new AbortController();

  let isFirstRender = true;

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        if (!isOpen || isFirstRender) return;
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
        if (isOpen || isFirstRender) return;
        const animation = exit(element);
        updateAnimationQueue(animation);
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

  element.addEventListener(
    "click",
    () => {
      if (state.isAnimating) return;
      close();
    },
    {
      signal: controller.signal,
    },
  );

  onCleanup(() => {
    controller.abort();
  });
};
