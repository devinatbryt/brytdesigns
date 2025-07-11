import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import type { Action } from "../consts";

import { createEffect, onCleanup } from "solid-js";
import { observeElementInViewport } from "observe-element-in-viewport";

import { useModalContext, withModalElementContext } from "../hooks/index.js";

type Props = {
  target?: string;
  action?: Action | "";
  on?: keyof HTMLElementEventMap | "enter" | "exit";
  preventDefault: boolean;
};

export const Name = "modal-trigger";

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  withModalElementContext(
    () => props.target || "",
    () => ({
      on: props.on,
      action: props.action,
      preventDefault: props.preventDefault,
    }),
    (context, { on, action, preventDefault }) => {
      const controller = new AbortController();
      const [state, { open, close, toggle }] = useModalContext(context);
      switch (on) {
        case "enter": {
          let unsubscribe = null;
          if (action === "toggle") {
            unsubscribe = observeElementInViewport(element, open, close);
          }

          if (unsubscribe)
            controller.signal.addEventListener("abort", unsubscribe, {
              once: true,
            });
          break;
        }
        case "exit": {
          let unsubscribe = null;
          if (action === "toggle") {
            unsubscribe = observeElementInViewport(element, close, open);
          }

          if (unsubscribe)
            controller.signal.addEventListener("abort", unsubscribe, {
              once: true,
            });
          break;
        }

        default: {
          element.addEventListener(
            //@ts-ignore
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

      onCleanup(() => {
        controller.abort();
      });
    },
  );
};
