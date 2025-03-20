import type { Path } from "../utils";

import HybridCart from "@brytdesigns/shopify-hybrid-cart";
import { createMemo, createEffect, type Accessor } from "solid-js";
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
  return options.path;
}

const FullPropertyPathContext = createContext(createFullPathPropertyContext);

export function provideFullPropertyPathContext({
  element,
  path,
}: {
  element: WalkableNode;
  path: Accessor<ValidHybridPath>;
}): FullPropertyPathContextType {
  return provide(FullPropertyPathContext, { path }, element);
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
  // createEffect(() => {
  //   console.log(props.element);
  //   if (typeof basePath === "function") {
  //     console.log("Base path", basePath());
  //   }
  //   if (typeof props.path === "function") {
  //     console.log("Path", props.path());
  //   }
  // });
  return createMemo(() => {
    if (typeof basePath !== "function" && typeof props.path === "function") {
      return props.path();
    } else if (
      typeof basePath === "function" &&
      typeof props.path === "undefined"
    ) {
      return basePath();
    } else if (
      typeof basePath === "function" &&
      typeof props.path === "function"
    ) {
      return `${basePath()}.${props.path()}` as ValidHybridPath;
    }
    return "" as ValidHybridPath;
  });
}
