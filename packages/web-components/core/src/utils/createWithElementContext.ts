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
    target: string | Accessor<string> | Accessor<() => Element>,
    dependencies: Accessor<D> = () => null as D,
    cb: (context: ContextState, dependencies: D) => void | (() => void),
  ) {
    createEffect(
      on(
        () => {
          const t = typeof target === "string" ? target : target();
          return {
            target: t,
            dependencies: dependencies(),
          };
        },
        ({ target: _target, dependencies }) => {
          const controller = new AbortController();
          invokeOnLoaded(
            () => {
              let target: Element | null =
                _target instanceof Element ? _target : null;
              try {
                if (typeof _target === "string")
                  target = document.querySelector(_target);
                else if (typeof _target === "function") target = _target();
              } catch (e) {
                e;
              }
              if (!target && typeof _target === "string")
                return console.warn(`Target element not found!`, {
                  target: _target,
                });
              else if (!target)
                return console.warn(`Target element not found!`);

              target.addEventListener(
                "bryt-designs:element-destroyed",
                () => {
                  controller.abort("Context element destroyed");
                },
                { once: true },
              );

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
            controller.abort("Dependencies changed!");
          });
        },
      ),
    );
  };
}
