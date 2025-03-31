import {
  type ICustomElement,
  createContext,
  provide,
  consume,
} from "component-register";
import { batch, createEffect, mergeProps, splitProps, untrack } from "solid-js";
import {
  toHyphenated,
  getContextFromProvider,
} from "@brytdesigns/web-component-utils";
import { useAccordion } from "./useAccordion.js";

type CreateContextOptions = {
  root: HTMLElement & ICustomElement;
  isExpanded: boolean;
  index: number;
  ariaExpanded: boolean;
};

type WalkableNode = Parameters<typeof provide>[2];

type AccordionItemContext = ReturnType<typeof initializeAccordionItemContext>;

function initializeAccordionItemContext(props: CreateContextOptions) {
  const [element, privateProps, stateProps] = splitProps(
    props,
    ["root"],
    ["ariaExpanded"],
  );
  const [context, methods] = useAccordion(element.root);

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

  createEffect(() => {
    const isActive = methods.item.isActive(props.index);
    batch(() => {
      setElementState("isExpanded", isActive);
      setElementState("ariaExpanded", isActive);
    });
  });

  createEffect(() => {
    const index = untrack(() => stateProps.index);
    const isExpanded = stateProps.isExpanded;
    if (isExpanded) methods.item.update(index);
  });

  function setActive(index: number) {
    methods.item.update(index);
  }

  return [
    mergeProps(stateProps, {
      get isAnimating() {
        return context.isAnimating;
      },
    }),
    { setElementState, setActive },
  ] as const;
}

const AccordionItemContextState = createContext(initializeAccordionItemContext);

export const provideAccordionItemContext = (
  initialState: Omit<CreateContextOptions, "root">,
  element: WalkableNode,
): AccordionItemContext => {
  const props = mergeProps(initialState, { root: element });
  return provide(AccordionItemContextState, props, element);
};

export const useAccordionItemContext = (context: AccordionItemContext) => {
  const [state, { setElementState, setActive }] = context;

  function expand() {
    const index = untrack(() => state.index);
    batch(() => {
      setActive(index);
      setElementState("isExpanded", true);
    });
  }

  function collapse() {
    batch(() => {
      setActive(-1);
      setElementState("isExpanded", false);
    });
  }

  function toggle() {
    setElementState("isExpanded", (v) => {
      const index = untrack(() => state.index);
      const newValue = !v;
      if (newValue) setActive(index);
      else setActive(-1);
      return newValue;
    });
  }

  return [state, { expand, collapse, toggle }] as const;
};

export const useAccordionItem = (element: HTMLElement & ICustomElement) => {
  const context: AccordionItemContext = consume(
    AccordionItemContextState,
    element,
  );

  if (!context) {
    throw console.error(
      "AccordionItemContext not found! Please ensure to wrap your custom element with accordion-item element.",
    );
  }

  return useAccordionItemContext(context);
};

export const getAccordionItemContext = (element: Element) => {
  const context = getContextFromProvider<AccordionItemContext>(
    AccordionItemContextState,
    element,
  );
  return useAccordionItemContext(context);
};
