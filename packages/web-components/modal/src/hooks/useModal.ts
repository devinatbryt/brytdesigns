import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import {
  createEffect,
  mergeProps,
  on,
  batch,
  splitProps,
  untrack,
} from "solid-js";
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

type ModalContext = ReturnType<typeof initializeModalContext>;

function initializeModalContext(props: CreateContextOptions) {
  const [element, stateProps] = splitProps(props, ["root"]);
  const [store, setStore] = createStore<StoreContext>({ animationQueue: [] });

  createEffect(
    on(
      () => store.animationQueue,
      (animationQueue) => {
        if (!animationQueue.length) return;
        const animations = Promise.all(store.animationQueue);
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
      const currentValue = untrack(() => props[key]);
      const result = value(currentValue || false);
      if (`${currentValue}` === `${value}`) return;
      element.root.setAttribute(toHyphenated(key), `${result}`);
      return;
    }
    if (`${currentValue}` === `${value}`) return;
    return element.root.setAttribute(toHyphenated(key), `${value}`);
  }

  return [
    mergeProps(store, stateProps),
    { setElementState, setStore },
  ] as const;
}

const ModalContextState = createContext(initializeModalContext);

export const provideModalContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): ModalContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(ModalContextState, props, element);
};

export const useModalContext = (context: ModalContext) => {
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

export const useModal = (element: HTMLElement & ICustomElement) => {
  const context: ModalContext = consume(ModalContextState, element);

  if (!context) {
    throw console.error(
      "ModalContext not found! Please ensure to wrap your custom element with modal-context element.",
    );
  }

  return useModalContext(context);
};

export const getModalContext = (element: Element) => {
  const context = getContextFromProvider<ModalContext>(
    ModalContextState,
    element,
  );
  return useModalContext(context);
};
