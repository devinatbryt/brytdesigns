import { type Accessor, createMemo } from "solid-js";
import { type ICustomElement } from "component-register";

import { type ValidHybridPath } from "./useFullPropertyPath.js";
import { useHybridCart } from "./useHybridCart.js";
import { getValueFromPath } from "../utils/index.js";

type Options = {
  path: Accessor<ValidHybridPath>;
  element: HTMLElement & ICustomElement;
};

export function useCartValue(options: Options) {
  const cart = useHybridCart(options.element);

  const value = createMemo(() => {
    const c = cart();
    if (typeof options.path !== "function") return cart;
    const path = options.path();
    if (!path) return cart;
    const v = getValueFromPath(c, path);
    if (v === undefined || v === null) return null;
    return v;
  });

  return value;
}
