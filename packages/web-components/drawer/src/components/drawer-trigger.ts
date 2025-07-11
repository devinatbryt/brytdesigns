import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import type { Action } from "../consts";

import { createEffect, onCleanup } from "solid-js";
import { observeElementInViewport } from "observe-element-in-viewport";

import { withDrawerElementContext, useDrawerContext } from "../hooks/index.js";

type DrawerTriggerProps = {
  target?: string;
  action?: Action | "";
  on?: keyof HTMLElementEventMap | "enter" | "exit";
  preventDefault: boolean;
};

export const Name = "drawer-trigger";

export const Component: CorrectComponentType<DrawerTriggerProps> = (
  props,
  { element },
) => {
  withDrawerElementContext(
    () => props.target || "",
    () => {
      return {
        action: props.action,
        on: props.on,
        preventDefault: props.preventDefault,
      };
    },
    (context, props) => {
      const controller = new AbortController();
      const { action, on, preventDefault } = props;
      const [state, { open, close, toggle }] = useDrawerContext(context);

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
