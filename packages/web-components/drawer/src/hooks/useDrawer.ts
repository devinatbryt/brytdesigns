import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import {
  createEffect,
  on,
  batch,
  splitProps,
  untrack,
  mergeProps,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";

import type { AnimationPlaybackControlsWithThen } from "motion";
import { abortablePromise } from "@brytdesigns/web-component-core/promise";
import { awaitAllAnimations } from "@brytdesigns/web-component-core/animation";
import {
  createWithElementContext,
  toHyphenated,
  getContextFromProvider,
} from "@brytdesigns/web-component-core/utils";

type StoreContext = {
  animationQueue: AnimationPlaybackControlsWithThen[];
};

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  isOpen: boolean;
  isAnimating: boolean;
};

type WalkableNode = Parameters<typeof provide>[2];

type DrawerContext = ReturnType<typeof initializeDrawerContext>;

function initializeDrawerContext(props: CreateContextOptions) {
  const [_internal, _state] = splitProps(props, ["root"]);
  const [store, setStore] = createStore<StoreContext>({ animationQueue: [] });

  createEffect(
    on(
      () => store.animationQueue,
      (animationQueue) => {
        if (!animationQueue.length) return;
        const controller = new AbortController();
        const animations = awaitAllAnimations(animationQueue);
        const abortableAnimations = abortablePromise(
          animations,
          controller.signal,
        );
        setElementState("isAnimating", true);
        abortableAnimations.finally(() => {
          batch(() => {
            setElementState("isAnimating", false);
            setStore("animationQueue", []);
          });
        });

        return onCleanup(() => {
          controller.abort("Aborting drawer animations");
        });
      },
    ),
  );

  function setElementState(
    key: keyof Omit<CreateContextOptions, "root">,
    value: boolean | ((v: boolean) => boolean),
  ) {
    const currentValue = untrack(() => props[key]);
    if (typeof value === "function") {
      const result = value(currentValue || false);
      if (`${currentValue}` === `${result}`) return;
      _internal.root.setAttribute(toHyphenated(key), `${result}`);
      return;
    }
    if (`${currentValue}` === `${value}`) return;
    return _internal.root.setAttribute(toHyphenated(key), `${value}`);
  }

  return [mergeProps(_state, store), { setElementState, setStore }] as const;
}

const DrawerContextState = createContext(initializeDrawerContext);

export const provideDrawerContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): DrawerContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(DrawerContextState, props, element);
};

export const useDrawerContext = (context: DrawerContext) => {
  const [state, { setElementState, setStore: setState }] = context;

  function updateAnimationQueue(animation: AnimationPlaybackControlsWithThen) {
    setState("animationQueue", (state) => [...state, animation]);
  }

  function close() {
    setElementState("isOpen", false);
  }

  function open() {
    setElementState("isOpen", true);
  }

  function toggle() {
    setElementState("isOpen", (open) => !open);
  }

  return [state, { updateAnimationQueue, close, open, toggle }] as const;
};

export const useDrawer = (element: HTMLElement & ICustomElement) => {
  const context: DrawerContext = consume(DrawerContextState, element);

  if (!context) {
    throw console.error(
      "DrawerContext not found! Please ensure to wrap your custom element with drawer-context element.",
    );
  }

  return useDrawerContext(context);
};

export const withDrawerElementContext = createWithElementContext<
  typeof DrawerContextState,
  DrawerContext
>(DrawerContextState);

export const getDrawerContext = (element: Element) => {
  const context = getContextFromProvider<DrawerContext>(
    DrawerContextState,
    element,
  );
  return useDrawerContext(context);
};
