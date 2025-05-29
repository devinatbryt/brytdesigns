import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import { createEffect, on, batch, splitProps, untrack } from "solid-js";
import { createStore } from "solid-js/store";
import {
  toHyphenated,
  getContextFromProvider,
} from "@brytdesigns/web-component-utils";

type StoreContext = {
  animationQueue: Promise<unknown>[];
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
        const animations = Promise.all([...store.animationQueue]);
        setElementState("isAnimating", true);
        animations.then(() => {
          batch(() => {
            setElementState("isAnimating", false);
            setStore("animationQueue", []);
          });
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

  return [
    {
      get isOpen() {
        return _state.isOpen;
      },
      get isAnimating() {
        return _state.isAnimating;
      },
      get animationQueue() {
        return store.animationQueue;
      },
    },
    { setElementState, setStore },
  ] as const;
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

  function updateAnimationQueue(animation: Promise<unknown>) {
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

export const getDrawerContext = (element: Element) => {
  const context = getContextFromProvider<DrawerContext>(
    DrawerContextState,
    element,
  );
  return useDrawerContext(context);
};
