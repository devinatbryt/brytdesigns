import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup, splitProps } from "solid-js";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock-upgrade";
import { createFocusTrap } from "@brytdesigns/web-component-core/focusTrap";

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

  const focusTrap = createFocusTrap(element, () => ({
    allowOutsideClick: true,
    escapeDeactivates: restProps.closeOnEscape,
    onDeactivate: () => {
      setElementState("isOpen", false);
    },
  }));

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
      }),
      ({ isOpen, isAnimating }) => {
        if (isOpen && !isAnimating)
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
    disableBodyScroll(element);
  });
};
