import type { Path } from "../utils";

import AjaxCart from "@brytdesigns/shopify-ajax-cart";
import { createMemo, type Accessor } from "solid-js";
import {
  createContext,
  consume,
  provide,
  type ICustomElement,
} from "component-register";

type AjaxCartData = (typeof AjaxCart)["data"];

export type ValidAjaxPath = Path<AjaxCartData>;

type WalkableNode = Parameters<typeof provide>[2];

type FullPropertyPathContextType = ReturnType<
  typeof createFullPathPropertyContext
>;

type Options = {
  path: Accessor<ValidAjaxPath>;
  element: HTMLElement & ICustomElement;
};

function createFullPathPropertyContext(
  options: Options,
): Accessor<ValidAjaxPath> {
  return options.path;
}

const FullPropertyPathContext = createContext(createFullPathPropertyContext);

export function provideFullPropertyPathContext({
  element,
  path,
}: {
  element: WalkableNode;
  path: Accessor<ValidAjaxPath>;
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
  path?: Accessor<ValidAjaxPath>;
}) {
  const context = consume(FullPropertyPathContext, props.element);
  const basePath = useFullPropertyPathContext(context);
  return createMemo(() => {
    if (typeof basePath !== "function" && typeof props.path === "function") {
      return props.path();
    } else if (
      typeof basePath === "function" &&
      typeof props.path !== "function"
    ) {
      return basePath();
    } else if (
      typeof basePath === "function" &&
      typeof props.path === "function"
    ) {
      return `${basePath()}.${props.path()}` as ValidAjaxPath;
    }
    return "" as ValidAjaxPath;
  });
}
