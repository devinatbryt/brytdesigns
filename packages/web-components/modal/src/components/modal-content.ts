import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup } from "solid-js";
import { animate } from "motion";

import { useModal } from "../hooks/index.js";
import { controlPromise, getTransitionConfig } from "../utils.js";

type DrawerContentProps = {};

export const DrawerContent: CorrectComponentType<DrawerContentProps> = (
  props,
  { element },
) => {
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
    // let position = style.getPropertyValue("--d-position") as Position;
    // if (!position) position = POSITION.LEFT;
    // const transform = convertPositionToTranslate(position);

    return animate(
      element,
      {
        // transform,
      },
      transition,
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const transition = getTransitionConfig(style);
    // let position = style.getPropertyValue("--d-position") as Position;
    // if (!position) position = POSITION.LEFT;
    // const transform = convertPositionToTranslate(position);
    return animate(
      element,
      {
        // transform,
      },
      transition,
    );
  }
};
