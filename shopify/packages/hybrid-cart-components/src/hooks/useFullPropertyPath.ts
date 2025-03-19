import type { Path } from "../utils";

import HybridCart from "@brytdesigns/shopify-hybrid-cart";
import { type Accessor } from "solid-js";
import {
  createContext,
  consume,
  provide,
  type ICustomElement,
} from "component-register";

type HybridCartData = (typeof HybridCart)["data"];

export type ValidHybridPath = Path<HybridCartData>;

type WalkableNode = Parameters<typeof provide>[2];

type FullPropertyPathContextType = ReturnType<
  typeof createFullPathPropertyContext
>;

type Options = {
  path: Accessor<ValidHybridPath>;
  element: HTMLElement & ICustomElement;
};

function createFullPathPropertyContext(
  options: Options,
): Accessor<ValidHybridPath> {
  return useFullPropertyPath({ element: options.element, path: options.path });
}

const FullPropertyPathContext = createContext(createFullPathPropertyContext);

export function provideFullPropertyPathContext({
  element,
  path,
}: {
  element: WalkableNode;
  path: Accessor<ValidHybridPath>;
}): FullPropertyPathContextType {
  return provide(FullPropertyPathContext, { path, element }, element);
}

export function useFullPropertyPathContext(
  context: FullPropertyPathContextType,
) {
  return context;
}

export function useFullPropertyPath(props: {
  element: HTMLElement & ICustomElement;
  path?: Accessor<ValidHybridPath>;
}) {
  const context = consume(FullPropertyPathContext, props.element);
  const basePath = useFullPropertyPathContext(context);
  return () => {
    const b = basePath();
    if (typeof props.path === "undefined") return b;
    const p = props.path();
    if (!b) return p;
    return `${b}.${p}` as ValidHybridPath;
  };
}
