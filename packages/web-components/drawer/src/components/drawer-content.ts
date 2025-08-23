import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createEffect, on, onCleanup, onMount } from "solid-js";
import { animate } from "motion";
import { getTransitionConfig } from "@brytdesigns/web-component-core/animation";

import { useDrawer } from "../hooks/index.js";
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
    const transition = getTransitionConfig(style);
    let position = style.getPropertyValue(`--${Name}--position`) as Position;
    if (!position) position = POSITION.LEFT;

    let transform: Record<string, string[]> = {
      x: [
        `var(--drawer-content--slide-from)`,
        `var(--drawer-content--slide-to)`,
      ],
    };

    if (position === POSITION.TOP || position === POSITION.BOTTOM) {
      transform = {
        y: [
          `var(--drawer-content--slide-from)`,
          `var(--drawer-content--slide-to)`,
        ],
      };
    }

    return animate(
      element,
      {
        ...transform,
      },
      transition,
    );
  }

  function exit(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    const transition = getTransitionConfig(style);
    let position = style.getPropertyValue(`--drawer--position`) as Position;
    if (!position) position = POSITION.LEFT;

    let transform: Record<string, string[]> = {
      x: [`var(--drawer--slide-to)`, `var(--drawer--slide-from)`],
    };

    if (position === POSITION.TOP || position === POSITION.BOTTOM) {
      transform = {
        y: [`var(--drawer--slide-to)`, `var(--drawer--slide-from)`],
      };
    }

    return animate(
      element,
      {
        ...transform,
      },
      transition,
    );
  }
};
