import {
  invokeOnLoaded,
  type CorrectComponentType,
} from "@brytdesigns/web-component-utils";
import type { Action } from "../consts";

import { createEffect, createRoot, on as _on, onCleanup } from "solid-js";
import { observeElementInViewport } from "observe-element-in-viewport";

import { getModalContext } from "../hooks/index.js";

type Props = {
  target?: string;
  action?: Action | "";
  on?: keyof HTMLElementEventMap | "enter" | "exit";
  preventDefault: boolean;
};

export const Name = "modal-trigger";

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  createEffect(() => {
    const targetProp = props.target,
      action = props.action,
      on = props.on,
      preventDefault = props.preventDefault;

    if (!targetProp)
      return console.warn(`${Name}: target prop is required!`, element);
    if (!action)
      return console.warn(`${Name}: action prop is required!`, element);
    if (action !== "close" && action !== "open" && action !== "toggle")
      return console.warn(
        `${Name}: action prop must be 'close', 'open', or 'toggle'`,
      );
    if (!on) return console.warn(`${Name}: on prop is required!`);

    const target = document.querySelector(targetProp);
    if (!target)
      return console.warn(`${Name}: target element not found!`, {
        element,
        target: targetProp,
      });

    const controller = new AbortController();

    invokeOnLoaded(
      () => {
        createRoot((dispose) => {
          const [state, { open, close, toggle }] = getModalContext(target);

          switch (on) {
            case "enter": {
              let unsubscribe = null;
              if (action === "toggle") {
                unsubscribe = observeElementInViewport(element, open, close);
              }

              if (unsubscribe) onCleanup(unsubscribe);
              break;
            }
            case "exit": {
              let unsubscribe = null;
              if (action === "toggle") {
                unsubscribe = observeElementInViewport(element, close, open);
              }

              if (unsubscribe) onCleanup(unsubscribe);
              break;
            }

            default: {
              element.addEventListener(
                on,
                (event) => {
                  if (preventDefault) event.preventDefault();
                  if (state.isAnimating) return;
                  switch (action) {
                    case "close":
                      close();
                      break;
                    case "open":
                      open();
                      break;
                    case "toggle":
                      toggle();
                      break;
                  }
                },
                { signal: controller.signal },
              );
              break;
            }
          }

          createEffect(() => {
            element.setAttribute("is-open", `${state.isOpen}`);
            element.setAttribute("is-animating", `${state.isAnimating}`);
          });

          controller.signal.addEventListener("abort", dispose, { once: true });
        });
      },
      { signal: controller.signal },
    );

    return onCleanup(() => {
      controller.abort();
    });
  });
};
