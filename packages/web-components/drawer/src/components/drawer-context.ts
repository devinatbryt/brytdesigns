import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createMemo, createEffect, on, onCleanup, splitProps } from "solid-js";
import {
  enableBodyScroll,
  disableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock-upgrade";
import { createFocusTrap } from "focus-trap";

import { provideDrawerContext, useDrawerContext } from "../hooks/index.js";
import { hideElement, showElement } from "../utils.js";

type DrawerContextProps = {
  isOpen: boolean;
  id: string;
  closeOnEscape: boolean;
  shouldTrapFocus: boolean;
  isAnimating: boolean;
  debug?: boolean;
};

export const Name = `drawer-context`;

export const Component: CorrectComponentType<DrawerContextProps> = (
  props,
  { element },
) => {
  const [contextProps, restProps] = splitProps(props, [
    "isOpen",
    "isAnimating",
  ]);

  const context = provideDrawerContext(contextProps, element);

  const [state, { setElementState }] = context;

  const [_, { updateAnimationQueue, ...events }] = useDrawerContext(context);

  element.actions = events;

  const focusTrap = createMemo(() => {
    return createFocusTrap(element, {
      allowOutsideClick: true,
      escapeDeactivates: restProps.closeOnEscape,
      onDeactivate: () => {
        setElementState("isOpen", false);
      },
    });
  });

  createEffect(() => {
    if (!props.debug) return;
    console.table({
      ...state,
    });
  });

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        const eventName = isOpen ? "drawer:open" : "drawer:close";
        element.dispatchEvent(
          new CustomEvent(eventName, {
            bubbles: true,
            detail: { isOpen, relatedTarget: element },
          }),
        );
        element.dispatchEvent(
          new CustomEvent("drawer:toggle", {
            bubbles: true,
            detail: { isOpen, relatedTarget: element },
          }),
        );
      },
    ),
  );

  createEffect(
    on(
      () => ({
        isOpen: state.isOpen,
        focusTrap: focusTrap(),
        shouldTrapFocus: restProps.shouldTrapFocus,
      }),
      ({ isOpen, focusTrap, shouldTrapFocus }) => {
        if (!isOpen) return;
        if (props.debug) console.log("Showing element", element);
        showElement(element);
        if (!shouldTrapFocus) return;
        focusTrap.activate();
        onCleanup(focusTrap.deactivate);
      },
    ),
  );

  createEffect(
    on(
      () => ({
        isOpen: state.isOpen,
        isAnimating: state.isAnimating,
        shouldTrapFocus: restProps.shouldTrapFocus,
      }),
      ({ isOpen, isAnimating, shouldTrapFocus }) => {
        if (isOpen && !isAnimating && shouldTrapFocus)
          return disableBodyScroll(element, {
            allowTouchMove: (el: EventTarget) => {
              if (el instanceof HTMLElement) {
                let element = el as (EventTarget & HTMLElement) | null;
                while (element && element !== document.body) {
                  if (element.tagName === "DRAWER-CONTENT") {
                    return true;
                  }

                  element = element.parentElement;
                }
              }
              return false;
            },
          });
        onCleanup(() => {
          if (!shouldTrapFocus) return;
          enableBodyScroll(element);
        });
      },
    ),
  );

  createEffect(
    on(
      () => ({ isOpen: state.isOpen, animationQueue: state.animationQueue }),
      ({ isOpen, animationQueue }) => {
        if (isOpen) return;
        if (props.debug)
          console.log("Waiting for animations to complete...", animationQueue);
        return Promise.all(animationQueue)
          .then(() => hideElement(element))
          .then(() => {
            if (props.debug) console.log("Hiding element", element);
          });
      },
    ),
  );

  onCleanup(() => {
    clearAllBodyScrollLocks();
  });
};
