import type { createContext } from "component-register";
import { getContextFromProvider } from "./getContextFromProvider.js";
import { invokeOnLoaded } from "./invokeOnLoaded.js";
import {
  type Accessor,
  createEffect,
  createRoot,
  on,
  onCleanup,
} from "solid-js";

/**
 * Creates a HOF to ensure that a given callback is invoked only after the context for the element is ready.
 * */

export function createWithElementContext<
  Context extends ReturnType<typeof createContext>,
  ContextState = null,
>(context: Context) {
  return function <D extends any>(
    selector: string | Accessor<string>,
    dependencies: Accessor<D> = () => null as D,
    cb: (context: ContextState, dependencies: D) => void | (() => void),
  ) {
    createEffect(
      on(
        () => {
          const s: string =
            typeof selector === "string" ? selector : selector();
          return {
            selector: s,
            dependencies: dependencies(),
          };
        },
        ({ selector, dependencies }) => {
          const controller = new AbortController();
          invokeOnLoaded(
            () => {
              let target: Element | null = null;
              try {
                target = document.querySelector(selector);
              } catch (e) {
                e;
              }
              if (!target)
                return console.warn(`Target element not found!`, {
                  target: selector,
                });

              createRoot((dispose) => {
                const c = getContextFromProvider(context, target);

                const unsub = cb(c as ContextState, dependencies);

                onCleanup(() => {
                  if (typeof unsub === "function") unsub();
                });

                controller.signal.addEventListener("abort", dispose, {
                  once: true,
                });
              });
            },
            { signal: controller.signal },
          );

          // abort controller when dependencies change
          onCleanup(() => {
            controller.abort();
          });
        },
      ),
    );
  };
}
