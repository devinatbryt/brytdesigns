import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on, onCleanup, onMount, splitProps } from "solid-js";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock-upgrade";
import { createFocusTrap } from "@brytdesigns/web-component-core/focusTrap";

import { provideModalContext, useModalContext } from "../hooks/index.js";
import { hideElement, showElement } from "../utils.js";

type ModalContextProps = {
  isOpen: boolean;
  id: string;
  closeOnEscape: boolean;
  shouldTrapFocus: boolean;
  isAnimating: boolean;
  delay: number;
};

export const Name = "modal-context";

export const Component: CorrectComponentType<ModalContextProps> = (
  props,
  { element },
) => {
  const [contextProps, restProps] = splitProps(props, [
    "isOpen",
    "isAnimating",
  ]);

  const context = provideModalContext(contextProps, element);

  const [state, { setElementState }] = context;

  const [_, { updateAnimationQueue, ...events }] = useModalContext(context);

  element.actions = events;

  const focusTrap = createFocusTrap(element, () => ({
    allowOutsideClick: true,
    escapeDeactivates: restProps.closeOnEscape,
    onDeactivate: () => {
      setElementState("isOpen", false);
    },
  }));

  createEffect(
    on(
      () => state.isOpen,
      (isOpen) => {
        const eventName = isOpen ? "modal:open" : "modal:close";
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
      ({ isOpen, isAnimating }) => {
        if (isOpen && !isAnimating)
          return disableBodyScroll(element, {
            allowTouchMove: (el: EventTarget) => {
              if (el instanceof HTMLElement) {
                let element = el as (EventTarget & HTMLElement) | null;
                while (element && element !== document.body) {
                  if (element.tagName === "MODAL-PANEL") {
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
        return Promise.all(animationQueue).then(() => hideElement(element));
      },
    ),
  );

  let openAfterDelayTimeoutId: any = null;

  onMount(() => {
    if (!restProps.delay || contextProps.isOpen) return;

    openAfterDelayTimeoutId = setTimeout(() => {
      setElementState("isOpen", true);
    }, props.delay);

    return onCleanup(() => {
      clearTimeout(openAfterDelayTimeoutId);
    });
  });

  createEffect(
    on(
      () => ({
        isOpen: state.isOpen,
        openAfterDelay: restProps.delay > 0,
      }),
      ({ isOpen, openAfterDelay }) => {
        if (!openAfterDelay && openAfterDelayTimeoutId)
          clearTimeout(openAfterDelayTimeoutId);
        if (isOpen && openAfterDelayTimeoutId)
          clearTimeout(openAfterDelayTimeoutId);
      },
    ),
  );

  onCleanup(() => {
    disableBodyScroll(element);
  });
};
