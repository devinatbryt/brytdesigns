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
  createSelector,
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
  isAnimating: boolean;
  activeIndex: number;
};

type WalkableNode = Parameters<typeof provide>[2];

type AccordionContext = ReturnType<typeof initializeAccordionContext>;

function initializeAccordionContext(props: CreateContextOptions) {
  const [element, stateProps] = splitProps(props, ["root"]);
  const [store, setStore] = createStore<StoreContext>({ animationQueue: [] });

  createEffect(
    on(
      () => store.animationQueue,
      (animationQueue) => {
        if (!animationQueue.length) return;
        const animations = Promise.allSettled(store.animationQueue);
        setElementState("isAnimating", true);
        animations.finally(() => {
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
    value: boolean | number | ((v: boolean | number) => boolean | number),
  ) {
    const currentValue = untrack(() => props[key]);
    if (typeof value === "function") {
      let result: boolean | number = false;
      if (typeof currentValue === "number") {
        result = value(currentValue || 0);
      } else if (typeof currentValue === "boolean") {
        result = value(currentValue || false);
      }
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

const AccordionContextState = createContext(initializeAccordionContext);

export const provideAccordionContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): AccordionContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(AccordionContextState, props, element);
};

export const useAccordionContext = (context: AccordionContext) => {
  const [state, { setElementState, setStore: setState }] = context;

  function updateAnimationQueue(animation: Promise<unknown>) {
    setState("animationQueue", (state) => [...state, animation]);
  }

  function updateActiveIndex(index: number) {
    setElementState("activeIndex", index);
  }

  const isActive = createSelector(() => state.activeIndex);

  return [
    state,
    { updateAnimationQueue, item: { update: updateActiveIndex, isActive } },
  ] as const;
};

export const useAccordion = (element: HTMLElement & ICustomElement) => {
  const context: AccordionContext = consume(AccordionContextState, element);

  if (!context) {
    throw console.error(
      "AccordionContext not found! Please ensure to wrap your custom element with accordion-context element.",
    );
  }

  return useAccordionContext(context);
};

export const getAccordionContext = (element: Element) => {
  const context = getContextFromProvider<AccordionContext>(
    AccordionContextState,
    element,
  );
  return useAccordionContext(context);
};
