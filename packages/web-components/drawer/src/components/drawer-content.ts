import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup, onMount } from "solid-js";
import { animate } from "motion";

import { useDrawer } from "../hooks/index.js";
import {
  controlPromise,
  convertPositionToTranslate,
  getTransitionConfig,
} from "../utils.js";
import { POSITION, type Position } from "../consts.js";

type DrawerContentProps = {};

export const Name = `drawer-content`;

export const Component: CorrectComponentType<DrawerContentProps> = (
  _,
  { element },
) => {
  const [state, { updateAnimationQueue }] = useDrawer(element);

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
    const transition = getTransitionConfig(style);
    let position = style.getPropertyValue("--drawer--position") as Position;
    if (!position) position = POSITION.LEFT;
    const transform = convertPositionToTranslate(position);

    return animate(
      element,
      {
        transform,
      },
      transition,
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const transition = getTransitionConfig(style);
    let position = style.getPropertyValue("--drawer--position") as Position;
    if (!position) position = POSITION.LEFT;
    const transform = convertPositionToTranslate(position);
    return animate(
      element,
      {
        transform,
      },
      transition,
    );
  }
};
